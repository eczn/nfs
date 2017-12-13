import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Desktop from '@/components/Desktop'

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/login'
		}, 
		{
			path: '/login', 
			name: 'Login',
			component: Login
		}, 
		{
			path: '/desktop', 
			name: 'Desktop', 
			component: Desktop
		}
	]
});
