// PopupController.js
import Vue from 'vue'; 

function getPPP(){
	return Vue.prototype.$ppp; 
}

let PopupController = {}
PopupController.getPPP = getPPP; 

let count = 0; 

function PopupItem(option){
	this.active = false; 
	this.dropping = false; 

	option.style = option.style || {}; 
	option.style = Object.assign({
		left: 150 + 60 * count + 'px',
		top: 100 + 40 * count + 'px', 
		width: '600px',
		height: '700px',
		zIndex: 200 + count * 10
	}, option.style); 

	option.style.backgroundColor = option.style.backgroundColor || '#FFF'; 

	this.title = option.title || ''; 

	this.pid = option.type + '-' + count; 

	option.von = option.von || {}; 
	option.vbind = option.vbind || {}; 

	// Inc 
	count = count + 1;

	// Option Merged To This
	Object.assign(this, option); 


	this.von.close = this.von.close || (() => this.close()); 
}

var $html = document.getElementsByTagName('html')[0]; 

PopupItem.prototype.launch = function(){
	setTimeout(() => {
		this.active = true;	

		$html.setAttribute('class', 'banScroll');	 
	});
	return this;
}

PopupItem.prototype.close = function(){
	setTimeout(() => {
		this.active = false;


		if (getPPP().activeCount === 0) {
			$html.setAttribute('class', '');
		}
	});
	return this; 
}

PopupController.create = function(option){
	return new PopupItem(option); 
}

PopupController.__setPrototype = function(key, val){
	PopupItem.prototype[key] = val; 
}

export default PopupController; 
