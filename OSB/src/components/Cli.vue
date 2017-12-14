<template>
    <div @click="toFocus" class="cli">
        <div class="history">
            <div class="line" v-for="(line, idx) in history" :key="idx">
                <span t class="input-area">
                    <p class="path"></p>
                    <span>$ {{ line.path }} > </span>
                    <span t>{{ line.cmd }}</span>
                </span>

                
                <div class="error" v-if="line.err">
                    <div t>{{ line.msg }}</div>
                </div>
                <div class="normal" v-else>
                    <div class="cli-file" v-if="line.cTime">
                        <div t class="dir-list" v-if="line.isDirectory">
                            <div class="dir-filename" t v-for="(e, idx) in line.files"
                                :key="idx"
                                :style="{
                                    color: e.isDirectory ? 'rgb(255, 216, 102)' : '#FFF'
                                }">{{ e.isDirectory ? e.filename : e.filename + '.' + e.ext }}</div>
                        </div>
                    </div>
                </div>
                
                <div class="space-line"></div>
            </div>
        </div>
        <span t class="input-area">
            <p class="path"></p>
            <span>$ {{ pathStr }} > </span>
            <input @keydown="down" class="cmd-input" ref="cmdInput" id="test" autofocus t @keydown.enter="exec" type="text" v-model="cmd">
        </span>
    </div>
</template>

<script>
import fileOpener from '../utils/fileOpener'; 

let nfsTable = {
    'ls': true, 
    'df': true, 
    'read': true,
    'touch': true,
    'mkdir': true
}

export default {
    name: 'cli', 
    props: {
        nfsShell: {
            type: Function,
            required: true
        }
    }, 
    data(){
        return {
            cmd: '',
            pathList: ['/'], 
            history: [],
            preCmd: []
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
        window.t = this; 
    },
    methods: {
        exec(){
            let pre = this.cmd; 
            this.preCmd.unshift(pre); 

            let todos = this.cmd.trim().split(' ').filter(e => e);

            let cmd = todos.join(' '); 

            if (nfsTable[todos[0]]){
                todos = todos.map((todo, idx) => {
                    if (idx === 0) return todo; 

                    if (todo.startsWith('/')){
                        return todo; 
                    } else {
                        return this.pathAdd(todo); 
                    }
                }); 

                if (todos.length === 1){ todos.push(this.pathStr) }

                let toNfsShell = todos.join(' '); 
                console.log(todos); 
                console.log(cmd); 

                this.nfsShell(toNfsShell).then(res => {
                    if (!res) return; 
                    if (typeof res.data === 'object'){
                        if (res.code === 2000){
                            res.data.path = this.pathStr; 
                            res.data.cmd = this.preCmd[0];
                            this.history.push(res.data); 
                        } else {
                            res.data.err = true; 
                            this.history.push(res.data);
                        }
                    } else {
                        this.history.push({
                            path: this.pathStr, 
                            cmd: this.preCmd[0], 
                        }); 
                    }
                }); 
            } else {
                this.nativeProcess(todos); 
            }

            setTimeout(() => this.cmd = ''); 
        },
        toFocus(e){
            this.$refs.cmdInput.focus(); 
        },
        nativeProcess(todos){
            let todo = todos[0]; 
            let args = todos.slice(1); 

            if (this[todo] && (typeof this[todo] === 'function')){
                this[todo].apply(this, args); 
            } else {
                this.history.push({
                    path: this.pathStr, 
                    cmd: this.cmd, 
                    err: true, 
                    msg: `can't not execute "${this.cmd}"`
                }); 
                this.cmd = ''; 
            }
        },
        clear(){
            console.log('to clear screen')
            this.history = []; 
        },
        pathAdd(e){
            let temp = JSON.parse(JSON.stringify(this.pathList)); 

            return '/' + temp.slice(1).concat(e).join('/');  
        },
        cd(to){
            this.history.push({
                path: this.pathStr,
                cmd: this.preCmd[0]
            });
            
            if (to === '..'){
                this.pathList.pop(); 
            } else {
                this.nfsShell('ls ' + this.pathAdd(to)).then(ok => {
                    this.pathList.push(to); 
                }); 
            }
        },
        exit(){
            this.history.push({
                path: this.pathStr, 
                cmd: this.cmd, 
                err: true, 
                msg: 'bye'
            }); 
            this.cmd = ''; 
            setTimeout(() => {

            })
        },
        down(e){
            if (e.keyCode === 9){
                this.autoComplete();
                e.preventDefault(); 
            }
        },
        autoComplete(){
            console.log('start'); 

            let todos = this.cmd.trim().split(' ').filter(e => e);
            
            console.log(todos); 

            if (todos.length === 0) return; 

            let after = todos[todos.length - 1]; 

            this.nfsShell(`ls ${this.pathStr}`).then(res => {
                if (!res) return; 

                let { data } = res; 
                

                let d = data.files.filter(e => {
                    return e.filename.startsWith(after); 
                }); 

                console.log(d)

                if (d.length === 1){
                    let _cmd = this.cmd; 
                    let p = _cmd.lastIndexOf(' '); 
                    this.cmd = _cmd.substring(0, p + 1) + d[0].filename; 
                } else {
                    res.data.files = d; 
                    res.data.path = this.pathStr; 
                    res.data.cmd = this.cmd;
                    this.history.push(res.data); 
                }
            })
        },
        open(e){
            this.nfsShell(`ls ${this.pathAdd(e)}`).then(res => {
                if (!res) return; 
                let file = res.data; 

                // console.log(file, this.pathAdd(e)); 
                fileOpener(this.nfsShell, file, this.pathAdd(e)); 

                this.history.push({
                    path: this.pathStr,
                    cmd: this.cmd,
                    err: true
                }); 
                this.cmd = ''; 
            })
        }
    }
}
</script>

<style>
.cli {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 0; 
    padding: 15px
}

.cli [t] {
    font-size: 16px; 
}

.cli .cmd-input {
    background: none;
    font-family: inherit;  
    border: none; 
    color: #FFF; 
}

.cli .cmd-input:focus {
    outline: none; 

}

.dir-filename {
    display: inline-block;
    width: 50%; 
}

.space-line {
    min-height: 16px; 
}
</style>

