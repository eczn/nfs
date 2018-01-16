<template>
    <div class="text-container">
        <div class="btn" :class="{
            active: mMode
        }" @click="mMode = !mMode">Markdown</div>

        <div class="text-area"
            v-html="asText"
            v-if="!mMode"
        ></div>
        <div class="md text-area" v-else v-html="md"></div>

        <div class="bottom-bar">
            字数：{{ buffer.length }}
        </div>
    </div>
</template>

<script>
import http from '../utils/http.client'

require('../assets/mark-vally.css'); 

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
            buffer: [],
            mMode: false,
            md: ''
        }
    }, 
    computed: {
        asText(){
            return this.pureText.replace(/\n/g, '<br />');
        },
        pureText(){
            let buf = new Uint8Array(this.buffer); 
            let dnc = new TextDecoder(); 
            let text = dnc.decode(buf); 

            return text; 
        }
    }, 
    created(){
        this.loadFile().then(res => {
            this.loadMd(); 
        })        
    }, 
    methods: {
        loadFile(){
            return this.nfsShell('read ' + this.file_path).then(res => {
                this.buffer = res.data.data; 
            }); 
        },
        loadMd(){
            return http.post('/api/nfs/md-render', {
                text: this.pureText
            }).then(res => {
                let html = res.data; 

                this.md = html; 
            })
        }
    }
}
</script>

<style scoped>
.text-container {
    box-sizing: border-box;
    padding: 5%; 
    overflow: scroll;
    height: 100%;
}

.text-area {
    padding: 1.5em 0; 
    margin: 1.5em 0; 
    border-top: 1px solid #DDD; 
    border-bottom: 1px solid #DDD;
}

.btn {
    cursor: pointer;
    border: 1px solid #DDD; 
    display: inline-block;
    width: 6em;
    text-align: center; 
    padding: .3em 0; 
    border-radius: 3px; 
    transition: all .3s; 
}

.active {
    background-color: #555; 
    border: 1px solid #555; 
    color: #FFF; 
}

</style>
