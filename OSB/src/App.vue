<template>
	<div id="app">

		<router-view></router-view>
	</div>
</template>

<script>
import http from './utils/http.client'; 

export default {
	name: 'app',
	data(){
		return {}
	},
	created(){
		http.get('/api/nfs');
	},
	methods: {
		
	}
}
</script>

<style>
* {
	margin: 0; 
	padding: 0; 
	color: #555; 
	font-family: "Consolas", "Menlo"; 
}
</style>
