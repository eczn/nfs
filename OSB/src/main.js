// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import OSB from './osb'; 
import FONT from './font'; 
import Finder from './Finder'

Vue.config.productionTip = false;

Vue.use(OSB); 
Vue.use(Finder); 

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
}); 