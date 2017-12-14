// VuePPP
import PopupLayout from './PopupLayout'; 
import PopupController from './PopupController'; 
import dom_util from './dom_util'; 

// export default
let PPP = {}; 
// Counter; 
let COUNT = 0; 

PPP.install = function(Vue, option){
    let $dom_root_ppp = dom_util.createRoot(); 
    PopupLayout.el = $dom_root_ppp; 

    let $ppp = new Vue(PopupLayout); 
    PPP.$ = () => $ppp; 
    Vue.prototype.$ppp = $ppp; 
}

export default PPP; 
