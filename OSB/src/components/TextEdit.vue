<template>
    <div>
        <div v-html="asText"></div>
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
            let buf = new Uint8Array(this.buffer); 
            let dnc = new TextDecoder(); 
            let text = dnc.decode(buf); 

            return text.replace(/\n/g, '<br />');
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
