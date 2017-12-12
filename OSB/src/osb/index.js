// index.js
import Input from './Input'; 

let osb = {}; 


osb.install = function(Vue, config){
    Vue.component('osb-input', Input); 
}

export default osb; 
