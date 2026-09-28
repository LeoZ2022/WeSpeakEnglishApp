<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config" />
		
		<view class="pageMain">
			<view class="textBox">Please enter your email. We will send the new password to you.</view>
			<view class="borderInput">
				<input class="borderInputText" v-model="email"  placeholder="Your Email" />
			</view>
			
			<view class="borderInput">
				<image :src="codeImg" class="code" @click="getCodeImg"></image>
				<input class="borderInputText" type="number"  v-model="code" placeholder="Verification code" />
			</view>
			
			<view class="loginFoot">
				<button type="primary" class="loginBtn" @click="loginClick()"  :disabled=" code==='' || email==='' ">Send</button>
			</view>
			
		</view>
		
	</view>
</template>

<script>	
	import { config } from '../../config.js'
	import { findpass } from '../../models/index.js'
	export default {
		data() {
			return {
				config: {
					// 设置中间插槽标题将失效
					title: 'Forgot password',				
					rightButton: false,
					backgroundColor: [1, '#fafafa']
				}, 
				codeImg:'',
				code:'',
				email:'',
				sessionid:''
			}
		},
		components: {
		},
		onShow: function() {			
			this.getCodeImg()
		},
		onLoad() {
		},		
		methods: {
			getCodeImg(){
				this.sessionid = Date.parse(new Date()) + Math.floor(Math.random () * 900) + 100 
				this.codeImg = config.base_url+'/api/index/get_code?sessionid=' + this.sessionid
			},
			loginClick(){
				var _this = this
				var data = "email="+_this.email+"&verify_code="+_this.code + "&sessionid=" + this.sessionid
				
				findpass(data).then((res) => {
					uni.showModal({
						title: 'Email sending successful!',
						content: 'Check the email at '+_this.email,
						showCancel:false,
						confirmText:'Confirm',
						success: function (res) {
							setTimeout(function () {
								uni.navigateBack()
							}, 200);
						}
					});
				}).catch(err => {
					//console.log(err,222222)
				})
			}
		}
	}
</script>



