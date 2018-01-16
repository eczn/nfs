<template>
<div class="folder">
    <!-- <span>{{nfs._id}}</span> -->

    <div class="files">
        <div class="df-info textarea open-cli" @click="openCli" v-if="pathList.length === 1 && df">
            <h1 class="title">$ open ./</h1>
            <div>点击此处打开 nfsShell 工具</div>
        </div>

        <div class="df-info textarea" v-if="pathList.length === 1 && df">
            <h1 class="title">$ df</h1>
            <div>磁盘宿主：{{ df.DISK_LOCATION }}</div>
            <div>已用空间：{{ df.USER_USED_SIZE / 1024 }} KB</div>
            <div>剩余空间：{{ df.REMAIN_SIZE / 1024 }} KB</div>
            <div>磁盘实际大小：{{ df.DISK_SIZE / 1024 }} KB</div>
            <div>格式化后的大小：{{ df.RAW_SIZE / 1024 }} KB </div>
            <div>消耗了 {{ df.NFS_SIZE / 1024 }} KB 用于文件系统的构造</div>
            <div>块单元大小：{{ df.BLOCK_SIZE / 1024 }} KB</div>
        </div>

        <div class="textarea">
            <h1 class="title">$ ls {{ pathStr }} </h1>
        </div>
        <span @click="outside" v-if="pathList.length >= 2" class="cd-outside">
            <!-- <img src="../assets/back.png" class="test"> -->

            <file :file="{
                isDirectory: true,
                filename: '返回上级'
            }" :path-str="pathStr"></file>
        </span>
        <file @click="open(item)" :path-str="pathStr"
            v-for="(item, idx) in files" :key="idx" :file="item"
            :selected="
                preview ? item.filename === preview.file.filename : false
            "
        ></file>
    </div>

    <transition name="preview-load">
        <div class="preview" v-if="preview && df">
            <div class="file-preview" v-if="!preview.file.isDirectory">
                <div>{{ preview.file.ext }} 文件</div>
                <div>文件大小：{{ preview.file.size }} 字节</div>
                <div>实际占用：{{ preview.file.A1.length * df.BLOCK_SIZE }} 字节</div>
                <div>创建于：{{ dateView(preview.file.cTime) }}</div>
                <div>所有者：{{ preview.file.who || '无' }}</div>
                <div class="txt" v-if="preview.file.ext === 'txt'"
                    v-html="asText(preview.data) || '空文件'"
                ></div>
                <div class="png" v-else-if="preview.file.ext === 'png'">
                    <img :src="preview.url" />
                </div>
                <div class="png" v-else-if="preview.file.ext === 'jpg'">
                    <img :src="preview.url" />
                </div>
                <div v-else>该文件不支持预览</div>
            </div>
            <div class="dir-preview" v-else>
                <div>{{ preview.file.filename }} 文件夹</div>
                <div>子文件：{{ preview.file.files.length }} 个</div>
                <div>创建于：{{ dateView(preview.file.cTime) }}</div>
                <div>所有者：{{ preview.file.who }}</div>
            </div>

            <div class="preview-btns">
                <div class="close-preview" @click="preview = null">
                    关闭
                    <img src="../assets/close.png" />
                </div>
                <div class="app-start close-preview" @click="newWindow(preview.file)">
                    在新窗口中打开
                </div>
                <div class="rm close-preview" @click="rm(preview.file)">
                    删除这个文件
                </div>
                <div class="rm close-preview" @click="rename(preview.file)">
                    重命名
                </div>
            </div>
        </div>
    </transition>

    <div class="function">
        <span class="icon-wrap" @click="mkdir"><img src="../assets/new-folder.png" /></span>
        <span class="icon-wrap">
            <label for="file-upload">
                <img src="../assets/upload.png" />
            </label>
            <input hidden id="file-upload" @change="change" type="file" ref="file" />
        </span>
        <span class="icon-wrap" @click="initLoad"><img src="../assets/reload.png" /></span>
    </div>
</div>
</template>

<script>
import http from '@/utils/http.client'; 
import File from './File'; 
import loadAsDataURL from '../utils/loadAsDataURL';
import arrayBufferToBase64 from '../utils/arrayBufferToBase64';
import fileOpener from '../utils/fileOpener'; 


let todo = _id => (cmd, preprocess = 'none') => {
    return http.post('/api/nfs/cmd', {
        cmd, _id, preprocess
    }); 
}

export default {
    name: 'folder', 
    components: {
        File
    }, 
    props: {
        nfs: {
            type: Object, 
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    data(){
        return {
            files: [],
            pathList: ['/'],
            nfsShell: null, 
            preview: null, 
            clickTime: 0, 
            df: null 
        }
    }, 
    computed: {
        pathStr(){
            // return this.pathList.join(''); 
            let temp = JSON.parse(JSON.stringify(this.pathList)); 

            return '/' + temp.slice(1).join('/');  
        }
    },
    created(){
        this.nfsShell = todo(this.nfs._id); 
        // window.nfsShell = this.nfsShell; 

        this.nfsShell('df').then(res => {
            this.df = res.data; 
        })
        
        this.initLoad();

        // this.openCli(); 
    },
    methods: {
        dateView(ts){
            let d = new Date(ts); 

   
            let temp = [d.getHours(), d.getMinutes(), d.getSeconds()].map(e => {
                return ('00' + e).slice(-2); 
            }).join(':'); 

            return d.toLocaleDateString() + ' ' + temp; 
        },
        pathAdd(e){
            let temp = JSON.parse(JSON.stringify(this.pathList)); 

            return '/' + temp.slice(1).concat(e).join('/');  
        },
        initLoad(){
            this.nfsShell(`ls ${this.pathStr}`).then(res => {
                this.preview = null;

                let temp = res.data.files; 
                
                this.files = temp.filter(e => e.isDirectory).concat(
                    temp.filter(e => !e.isDirectory)
                ); 
                // this.open(this.files[0])
            })
        },
        open(file){
            if (file.who !== this.user.username) return alert(`该文件属于 ${file.who} 拒绝访问`); 

            this.clickTime = this.clickTime + 1; 
            setTimeout(() => {              
                this.clickTime = 0
            }, 200);

            if (this.clickTime === 2){
                // double click
                // 此处调出其他程序 
                clearTimeout(this.open.previewTimer); 

                if (file.isDirectory){
                    console.log(file)
                    this.pathList.push(file.filename); 
                    
                    this.initLoad(); 
                } else {
                    fileOpener(this.nfsShell, file, this.pathAdd(file.filename)); 
                }
            } else {
                this.open.previewTimer = setTimeout(() => {
                    this.nfsShell(`read ${this.pathAdd(file.filename)}`, 'url').then(res => {
                        this.preview = {
                            file: file, 
                            data: res.data.data,
                            url: res.data.url
                        }
                    }); 
                }, 200); 
            }
        },
        one$two(one, two){
            if (!this.one$two.clickTime) this.one$two.clickTime = 0; 

            this.one$two.clickTime = this.one$two.clickTime + 1; 

            setTimeout(() => {              
                this.one$two.clickTime = 0
            }, 200);

            if (this.one$two.clickTime === 2){
                // double click
                // 此处调出其他程序 
                clearTimeout(this.one$two.previewTimer); 

                two && two(); 
            } else {
                this.one$two.previewTimer = setTimeout(() => {
                    one && one(); 
                }, 200); 
            }
        },
        change(e){
			let $dom = this.$refs.file; 
            let file = $dom.files[0]; 
			let name = file.name; 
			let pos = name.lastIndexOf('.'); 
			let ext = name.substring(pos + 1); 
            let filename = name.substring(0, pos); 
            let target = this.pathAdd(filename);
            let username;
            let loadUser = http.get('/api/user/me');
            let loadB64 = loadAsDataURL(file); 
            let touchFile = this.nfsShell(`touch ${target} ${ext}`); 

            Promise.all([
                loadUser, 
                loadB64, 
                touchFile
            ]).then(([res, base64, touchOK]) => {
                username = res.data.username; 
                let p = base64.indexOf('base64,') + 'base64,'.length; 
                base64 = base64.substring(p); 

                return http.post('/api/nfs/cmd', {
                    _id: this.nfs._id,
                    cmd: `write ${target} %buf%`, 
                    buf_base64: base64
                })
            }).then(writeOk => {
                return this.nfsShell(`chown ${target} ${username}`); 
            }).then(allDone => {
                this.initLoad(); 
            });
        },
        mkdir(){
            let dirname = window.prompt('输入新文件夹名'); 
            if (!dirname) return; 

            Promise.all([
                http.get('/api/user/me'), 
                this.nfsShell(`mkdir ${this.pathAdd(dirname)}`)
            ]).then(([res, mkdirSucc]) => {
                let username = res.data.username; 
                return this.nfsShell(`chown ${this.pathAdd(dirname)} ${username}`); 
            }).then(allDone => {
                this.initLoad(); 
            })
        },
        outside(){
            this.clickTime = this.clickTime + 1; 
            setTimeout(() => {
                this.clickTime = 0
            }, 200);

            if (this.clickTime !== 2) return; 
            this.pathList.pop(); 
            this.initLoad(); 
            
        },
        toDataURL(buf, type = 'image/png'){
            // data:image/png;base64,
            return `data:${type};base64,` + arrayBufferToBase64(buf);
        },
        rm(file){
            let cmd = 'rm ' + this.pathAdd(file.filename); 

            this.nfsShell(cmd).then(ok => {
                this.initLoad(); 
            })
        },
        openCli(){
            fileOpener.cli(this.nfsShell); 
        },
        asText(data){
            let buf = new Uint8Array(data); 
            let dnc = new TextDecoder(); 
            let text = dnc.decode(buf); 

            return text.replace(/\n/g, '<br />');
        },
        newWindow(file){
            fileOpener(this.nfsShell, file, this.pathAdd(file.filename)); 
        },
        rename(file){
            let newName = window.prompt(); 

            if (!newName || !newName.trim()) return; 

            let cmd = 'rename ' + this.pathAdd(file.filename) + ' ' + newName; 

            this.nfsShell(cmd).then(res => {
                this.initLoad(); 
            })
        }
    }
}
</script>


<style lang="sass">
.preview-load-enter-active, .preview-load-leave-active 

/* .fade-leave-active in below version 2.1.8 */ 
.preview-load-enter, .preview-load-leave-to
    opacity: 0
    transform: translateY(30px)

.folder 
    overflow: hidden
    font-size: 0
    .preview, .files, .function
        font-size: 16px
        box-sizing: border-box
    .preview
        transition: all .3s
        position: absolute
        bottom: 0
        height: 30%
        background-color: rgba(255, 255, 255, .9)
        width: 100%
        .preview-btns
            text-align: right
            position: absolute
            right: 0
            top: 0
        .close-preview
            cursor: pointer
            padding: 1em
            img 
                width: 1em
        .close-preview:hover 
            background-color: #DDD

        .png 
            img 
                max-width: 100px
    .files 
        padding-top: 0px
        position: absolute
        top: 0
        width: 100%
        height: 100%
        overflow-y: scroll 
        // padding-bottom: 100%
        .with-preview 
            height: 70%
        .df-info 
            // position: absolute
            // height: 100%
            // width: 100%
            // left: 0
    .function 
        display: inline-block
        position: absolute
        top: -36px
        right: 0
        height: 36px
        line-height: 36px
        font-size: 0
        text-align: right
        * 
            line-height: 36px
            text-align: center
            vertical-align: middle
        .icon-wrap 
            cursor: pointer
            height: 100%
            display: inline-block
            width: 40px
            img 
                display: inline-block
                width: 28px
        
    .cd-outside 
        cursor: pointer

    .textarea 
        padding: 15px
        line-height: 1.5
    .open-cli 
        cursor: pointer

    .txt 
        width: 70%
        height: 100px
        overflow-y: scroll
        border: 1px solid #DDD
        margin-top: 1em;
</style>
