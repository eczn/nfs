<template>
	<div class="popup-layout" ref="popupRoot">
		<!-- <div class="finder"></div> -->

		<div v-for="(item, idx) in list" :key="item.pid" 
			class="popup-item" 
			@touchmove="disableScroll"
			:class="item.type + '-outter'"
			:style="item.style"

			v-if="item.active"
			@mousedown="toTop(idx)">


			<div
				inb
				@mousedown="dropStart(item, $event)"
				@mousemove="dropMove(item, $event)"
				@mouseup="dropEnd(item, $event)"
				@mouseleave="dropOutside(item, $event)"
				:style="{
					
				}"
				class="folder-header">
				{{ item.title || 'Finder' }}
				<span @click="item.active = false">关闭</span>
			</div>
			<!-- <div class="folder-header" style="background-color: #FFF"></div> -->

			<!-- <transition :name="item.transitionName || item.type"> -->

			<div>
				<component
					:is="item.component"
					v-bind="item[':'] || item.vbind"
					v-on="item['@'] || item.von"

					:class="item.type + '-component'"
				/>

				<div class="resizer"
					@mousedown="moveStart(item, $event)"
					@mousemove="moveMove(item, $event)"
					@mouseup="moveEnd(item, $event)"
				></div>
			</div>
			<!-- </transition> -->
		</div>
	</div>
</template>

<script>
import PopupController from './PopupController'; 

window.addEventListener('contextmenu', function(e){
	e.preventDefault();
	console.log(e)
})

export default {
	name: 'popup-layout', 
	data(){
		return {
			list: [],
			resizing: false
		}
	},
	created(){
		window.vm = this; 
		console.log('hello')
	},
	computed: {
		activeCount(){
			return this.list.reduce((acc, cur) => {
				return acc + (cur.active ? 1 : 0); 
			}, 0); 
		}
	},
	mounted($refs){
		console.log($refs)
	},
	methods: {
		toTop(idx){
			this.list.push(this.list.splice(idx, 1)[0])
		},
		dropStart(folder, e){
			// console.log(e); 
			folder.dropping = true; 
		},
		moveStart(folder, e){
			this.resizing = true; 
		},
		dropOutside(folder, e){
			// if (!folder.dropping) return; 
			this.dropMove(folder, e); 
		},
		dropMove(folder, e){
			if (folder.dropping){
				// console.log(e); 
				// let { clientX, clientY } = e; 
				// console.log(e); 
				let { movementX, movementY } = e; 
				folder.style.left = parseInt(folder.style.left) + movementX + 'px';
				folder.style.top = parseInt(folder.style.top) + movementY + 'px';  
			} else {
				return; 
			}
		},
		moveMove(folder, e){
			if (this.resizing){
				// console.log(e); 
				// let { clientX, clientY } = e; 
				// console.log(e); 
				let { movementX, movementY } = e; 
				folder.style.width = parseInt(folder.style.width) + movementX + 'px';
				folder.style.height = parseInt(folder.style.height) + movementY + 'px';  
			} else {
				return; 
			}
		},
		dropEnd(folder){
			folder.dropping = false; 
		},

		moveEnd(folder, e){
			this.resizing = false; 
		},

		create(config){
			let popupItem = PopupController.create(config); 
			this.list.push(popupItem); 

			return popupItem; 
		},
		disableScroll(e){
			this.$refs.popupRoot
		}
	}
}

</script>



<style scoped>
.finder {
	position: fixed; 
	top: 0; 
	left: 0;
	width: 100%; 
	height: 36px; 
	background-color: #DDD; 
}

.popup-item {
	position: fixed; 
	/* top: 100px;  */
	/* left: 200px; */
	/* border: 1px solid rgba(0, 0, 0, 0.1); */
	box-shadow: 0 48px 48px -24px rgba(0, 0, 0, .3); 
	box-sizing: border-box; 
	background-color: #FFF;
	/* overflow: hidden; */
}

.folder-header {
	position: absolute;
	width: 100%; 
	left: 0;
	top: -36px; 
	height: 36px; 
	line-height: 36px; 
	background-color: #FFF; 
	border-bottom: 1px solid #DDD; 
	box-sizing: border-box; 
}

.resizer {
	position: absolute; 
	cursor:	nwse-resize;
	bottom: -2em;
	right: 0px; 
	width: 100%;
	height: 2em;
	user-select: none; 
	/* background-color: #555; */
	background-size: 16px; 
	background-repeat: no-repeat; 
	background-position: right bottom; 
	background-color: #FFF; 
	background-image: url('../assets/resize.png');
	border-top: 1px solid #DDD; 
}

.modal-outter {
	/* position: absolute;
	left: 0;
	top: 0; 
	width: 100%; 
	height: 100%;  */
}

.modal-component {
	/* position: absolute;  */
	/* top: 24px;  */
	/* left: 0; */
	width: 100%; 
	/* min-height: 100px; */
	/* overflow: scroll; */
	/* -webkit-overflow-scrolling: touch; */
}

.modal-enter-active, .modal-leave-active {
	transition: all .6s; 
	transition-timing-function: cubic-bezier(0.18, 0.65, 0, 1); 
}

.modal-enter, .modal-leave-to {
	/* transform: translate3d(0, 100%, 0); */

}
</style>
