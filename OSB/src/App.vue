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
	user-select: none; 
}

[inb] {
	display: inline-block;
}
::-webkit-scrollbar {
    width: 5px;
    height: 16px;
    background-color: #AAA;
}

::-webkit-scrollbar-thumb {
    background-color: #AAA;
}

::-webkit-scrollbar-track {
    background-color: #E0E0E0;
}

::selection {
    color: #FFF;
    background-color: #C6BCBB;
}
</style>
