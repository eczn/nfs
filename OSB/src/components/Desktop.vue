<template>
    <div class="desktop">
        <div class="bg" :style="{
            backgroundImage: `url(${bg})`
        }"></div>
        <div class="disk-list">
            <div @click="openFolder(nfs)" class="disk"
                :class="{ selected: selected ? nfs._id === selected._id : selected }"
                v-for="(nfs, idx) in nfs_list" :key="idx">
                <img class="disk-icon" src="../assets/disk.svg" />
                <p>{{ nfs.owner.username }}: {{ nfs._id }}</p>
            </div>
            <div @click="newNfs" class="disk">
                <img class="disk-icon" src="../assets/disk-create.svg" />
                <p>创建磁盘</p>
            </div>
        </div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 
import Folder from './Folder'; 

export default {
    name: 'desktop', 
    data(){
        return {
            nfs_list: [],
            selected: null,
            clickTime: 0,
            user: {}, 
            bg: 'http://localhost/lib/egg.png' 
        }
    }, 
    created(){
        this.loadMe(); 
        this.loadNfs(); 
        this.loadBg(); 
        this.$eBus.$on('bgReload', () => {
            this.loadBg(); 
        })
    },
    methods: {
        loadMe(){
            return http.get('/api/user/me').then(res => {
                this.user = res.data; 
            }); 
        },
        loadBg(){
            this.bg = window.localStorage.getItem('bg') || this.bg; 
        }, 
        loadNfs(){
            http.get('/api/nfs').then(res => {
                this.nfs_list = res.data; 

                // this.openFolder(this.nfs_list[0]);
                // this.openFolder(this.nfs_list[0]);
            })
        },
        newNfs(){
            http.post('/api/nfs').then(ok => {
                let newNfs = ok.data; 

                this.nfs_list.push(newNfs); 
            })
        },
        openFolder(nfs){
            this.clickTime = this.clickTime + 1; 

            setTimeout(() => {
                this.clickTime = 0; 
            }, 200);

            if (this.clickTime === 2){
                console.log(Folder)
                let folder = this.$ppp.create({
                    type: 'modal', 
                    title: `[Finder] 用户名: ${this.user.username}`, 
                    component: Folder,
                    vbind: {
                        nfs: nfs,
                        user: this.user
                    }
                });
                folder.launch(); 
            } else {
                this.selected = nfs; 
            }
        }
    }
}
</script>

<style lang="sass">
.desktop 
    .disk
        cursor: pointer
        padding-bottom: 1em
        vertical-align: top
        margin: .5em
        display: inline-block
        width: 120px
        text-align: center
        p 
            color: #FFF
            word-break: break-all;
            white-space: pre-wrap;
        .disk-icon 
            width: 64px
            display: block
            margin: .5em auto; 
    .selected 
        background-color: rgba(255, 255, 255, .5)



.bg 
    position: fixed
    z-index: -1
    width: 100%
    left: 0
    top: 0
    height: 100%
    background-size: cover
    background-position: center
</style>
