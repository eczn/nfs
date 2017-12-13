<template>
	<div class="popup-layout" ref="popupRoot">
		<div v-for="(item, idx) in list" :key="item.pid" 
			class="popup-item" 
			@touchmove="disableScroll"
			:class="item.type + '-outter'"
			:style="{ left: item.left, top: item.top }"
			@mousedown="toTop(idx)">

			<div
				@mousedown="dropStart(item, $event)"
				@mousemove="dropMove(item, $event)"
				@mouseup="dropEnd(item, $event)"
				@mouseleave="dropOutside(item, $event)"
				class="folder-header">
				磁盘 {{ item.title }}
			</div>

			<transition :name="item.transitionName || item.type">
				<component v-if="item.active"
					:is="item.component"
					v-bind="item[':'] || item.vbind"
					v-on="item['@'] || item.von"

					:class="item.type + '-component'"
				/>
			</transition>
		</div>
	</div>
</template>

<script>
import PopupController from './PopupController'; 

export default {
	name: 'popup-layout', 
	data(){
		return {
			list: []
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
	methods: {
		toTop(idx){
			this.list.push(this.list.splice(idx, 1)[0])
		},
		dropStart(folder, e){
			// console.log(e); 
			folder.dropping = true; 
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
				folder.left = parseInt(folder.left) + movementX + 'px';
				folder.top = parseInt(folder.top) + movementY + 'px';  
			} else {
				return; 
			}
		},
		dropEnd(folder){
			folder.dropping = false; 
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
.popup-item {
	position: fixed; 
	/* top: 100px;  */
	/* left: 200px; */
	width: 400px; 
	height: 300px;
	border: 1px solid #DDD;
	border-radius: 5px;
	background-color: rgba(255, 255, 255, 0.8);
}

.folder-header {
	position: relative;
	background-color: #DDD; 
	height: 36px; 
	line-height: 36px; 
	user-select: none; 
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
