<template>
    <div>
        <div class="bg"></div>
        <div class="disk-list">
            <div @click="openFolder(nfs)" class="disk" v-for="(nfs, idx) in nfs_list" :key="idx">
                {{ nfs._id }}
            </div>
        </div>
        <div @click="newNfs" class="add-new">创建磁盘</div>
    </div>
</template>

<script>
import http from '@/utils/http.client'; 
import Folder from './Folder'; 

export default {
    name: 'desktop', 
    data(){
        return {
            nfs_list: []
        }
    }, 
    created(){
        window.vm = this; 
        this.loadNfs(); 
    },
    methods: {
        loadNfs(){
            http.get('/api/nfs').then(res => {
                this.nfs_list = res.data; 

                this.openFolder(this.nfs_list[0]);
                // this.openFolder(this.nfs_list[1]);
                // this.nfs_list.forEach(this.openFolder.bind(this));
            })
        },
        newNfs(){
            http.post('/api/nfs').then(ok => {
                let newNfs = ok.data; 

                this.nfs_list.push(newNfs); 
            })
        },
        openFolder(nfs){
            console.log(Folder)
            let folder = this.$ppp.create({
                type: 'modal', 
                component: Folder,
                vbind: {
                    nfs: nfs,
                    style: {
                        backgroundColor: '#FFF'
                    }
                }
            });

            folder.launch(); 
        }
    }
}
</script>

<style lang="sass">

</style>
