<template>
	<div class="login-containner">
		<div class="bg"></div>
		<div class="login-inner">
			<div class="user-input">
				<div class="avatar" :style="{
					backgroundImage: `url(https://io.chenpt.cc/banner/love.png)`
				}" />

				<div class="input-area">
					<osb-input class="user-input" 
						:input="username"
					></osb-input>

					<osb-input class="user-input" 
						right-icon="more" 
						:input="pwd"
						@enter="toLogin"
					></osb-input>
				</div>

				<div class="btns">
					<osb-btn @click="toLogin" text="确定"></osb-btn>
					<osb-btn @click="toRegister" text="注册"></osb-btn>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/utils/http.client'; 

export default {
	name: 'login',
	data(){
		return {
			pwd: {
				type: 'password', 
				placeholder: '*', 
				val: '', 
				style: {
					textAlign: 'center',
					fontSize: '120%'
				}
			},
			username: {
				type: 'text', 
				placeholder: '@', 
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
	computed: {
		userInput(){
			return {
				pwd: this.pwd.val, 
				username: this.username.val
			}
		}
	}, 
	methods: {
		toLogin(e){
			http.post('/api/user/login', this.userInput).then(res => {
				if (res.code === 2000){
					this.$router.push({ path: '/desktop' })
				} else {
					alert(JSON.stringify(res)); 
				}
			}); 
		}, 
		toRegister(){
			http.post('/api/user', this.userInput).then(res => {
				if (res.code === 2000){
					alert('注册成功'); 

					this.toLogin(); 
				}
			}); 
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
		.input-area
			margin: 1em 0
			.user-input
				position: relative 
				margin: 1em 0
				text-align: center
		.avatar 
			margin-bottom: 1em
			display: inline-block
			border-radius: 50%
			width: 200px
			height: 200px
		
</style>
