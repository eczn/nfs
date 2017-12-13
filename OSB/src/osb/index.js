// index.js
import Input from './Input'; 
import Button from './Button'; 

let osb = {}; 


osb.install = function(Vue, config){
    Vue.component('osb-input', Input); 
    Vue.component('osb-btn', Button); 
}

export default osb; 
