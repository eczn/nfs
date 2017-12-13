<template>
<div>
    <!-- <span>{{nfs._id}}</span> -->
    <span>/..</span>
    <div class="files">
        <div @click="open(item)" class="file" v-for="(item, idx) in files" :key="idx">
            {{ item.isDirectory ? pathStr + item.filename : pathStr + item.filename + '.' + item.ext }}
        </div>
    </div>
</div>
</template>

<script>
import http from '@/utils/http.client'; 

let todo = _id => (cmd, process = 'none') => {
    return http.post('/api/nfs/cmd', {
        cmd, _id, process
    }); 
}

export default {
    name: 'folder', 
    props: {
        nfs: {
            type: Object, 
            required: true
        }
    },
    data(){
        return {
            files: [],
            pathList: ['/'],
            nfsShell: null
        }
    }, 
    computed: {
        pathStr(){
            return this.pathList.join('/'); 
        }
    },
    created(){
        this.nfsShell = todo(this.nfs._id); 

        this.nfsShell('ls /').then(res => {
            this.files = res.data.files; 
        })
    },
    methods: {
        open(file){
            if (file.ext === 'txt'){
                this.nfsShell(`read ${this.pathStr}${file.filename}`, 'string'); 
            }
        }
    }
}
</script>


<style>

</style>
