<template>
	<div class="login-containner">
		<div class="bg"></div>
		<div class="login-inner">
			<div class="user-input">
				<div class="avatar" :style="{
					backgroundImage: `url(https://io.chenpt.cc/banner/love.png)`
				}" />

				<osb-input class="user-input" 
					right-icon="more" 
					:input="userInput"
					@enter="toLogin"
				></osb-input>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'login',
	data(){
		return {
			userInput: {
				type: 'password', 
				placeholder: '*', 
				val: '', 
				style: {
					textAlign: 'center',
					fontSize: '120%'
				}
			}
		}
	},
	created(){

	},
	methods: {
		toLogin(e){

		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
.login-containner 
	text-align: center
	.bg 
		position: fixed
		height: 100%
		width: 100%
		background-color: #DDD
		z-index: -1
	.login-inner 
		padding-top: 5em 
		display: inline-block 
		.user-input
			position: relative 
			margin: 2em 0
			text-align: center
			.avatar 
				display: inline-block
				border-radius: 50%
				width: 200px
				height: 200px
		
</style>
