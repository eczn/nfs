<template>
    <div>
        <div>{{ asText }}</div>
        <div class="bottom-bar">
            字数：{{ buffer.length }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'text-edit',
    props: {
        nfsShell: {
            type: Function, 
            required: true
        }, 
        file: {
            type: Object, 
            required: true
        }, 
        file_path: {
            type: String, 
            required: true
        }
    },
    data(){
        return {
            buffer: []
        }
    }, 
    computed: {
        asText(){
            return this.buffer.reduce((str, e) => {
                return str + String.fromCharCode(e); 
            }, ''); 
        }
    }, 
    created(){
        this.loadFile(); 
    }, 
    methods: {
        loadFile(){
            return this.nfsShell('read ' + this.file_path).then(res => {
                this.buffer = res.data.data; 
            }); 
        }
    }
}
</script>

<style>
    
</style>
