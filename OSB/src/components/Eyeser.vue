<template>
    <div class="eyeser" @mousewheel="wheeling">
        <img class="img" :src="imgURL"
            @mousedown="moveStart"
            @mousemove="moveMove"
            @mouseup="moveEnd"
            draggable="false"
            :style="{
                width: width + '%',
                transform: `scale(${ zoom / 100 })`, 
                top: top + 'px', 
                left: left + 'px'
            }"/>
        <div class="para">
            <span class="zoom">x {{ zoom / 100 }}</span>
            <span class="set-bg" @click="setBg">设为壁纸</span>
        </div>
    </div>
</template>

<script>
import arrayBufferToBase64 from '../utils/arrayBufferToBase64';

export default {
    name: 'eyeser',
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
            imgURL: null, 
            width: 100,
            zoom: 100, 
            left: 0, 
            top: 0, 
            holdOn: false
        }
    }, 
    computed: {

    }, 
    created(){
        this.loadFile(); 
    }, 
    methods: {
        loadFile(){
            return this.nfsShell('read ' + this.file_path, 'url').then(res => {
                // this.imgBase64 = arrayBufferToBase64.as(res.data.data, 'image/' + this.file.ext); 
                this.imgURL = res.data.url
            }); 
        },
        wheeling(e){
            let { deltaY } = e;
            // this.width = this.width + (-deltaY / 10); 
            this.zoom = this.zoom + (-deltaY / 5); 
        },
        
		moveStart(e){
			this.holdOn = true; 
        },
        
		moveMove(e){
			if (this.holdOn){
                let { movementX, movementY } = e; 
				this.left = this.left + movementX;
				this.top = this.top + movementY;  
			} else {
				return; 
			}
        },

        setBg(){
            window.localStorage.setItem('bg', this.imgURL); 
            this.$eBus.$emit('bgReload'); 
        },

		moveEnd(e){
			this.holdOn = false; 
        },
        
        prevent(e){
            e.preventDefault();
        }
    }
}
</script>

<style>
.eyeser {
    position: absolute;
    top: 0; 
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden; 
    text-align: center; 
}

.eyeser img {
    position: absolute;
    display: block; 

    transition: transform .3s; 
    transform-origin: center; 
    cursor: move;
}

.para {
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%; 
    text-align: center; 
}
    
</style>
