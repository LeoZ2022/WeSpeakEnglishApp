<template>
	<view class="loginPage">
		<view class="loginTool">
			<scan :scanType="2"></scan>
		</view>
		<view class="loginHead">
			<image src="../../static/logo.png" class="loginLogo"></image>
		</view>
		
		<view class="loginMain">
			<view class="loginForm" :class="{ active: nameIsCut }">
				<text class="loginFormText">Email</text>
				<input class="uni-input-input" v-model="userName" @focus="focusName" @blur="blurName" />
			</view>
			
			<view class="loginForm" :class="{ active: pwdIsCut }">
				<text class="loginFormText">Password</text>
				<input class="uni-input-input" v-model="password" @focus="focusPwd"  @blur="blurPwd" type="password" />
			</view>
			
			<view class="loginCheckbox">
				<navigator url="/pages/login/forgotPwd"><text class="loginCheckboxText">Forgot password?</text></navigator>
				<label @click="remeber" >
					<checkbox :checked="remeberChecke"/> Remember me
				</label>
			</view>
			
			<view class="loginFoot">
				<button type="primary" class="loginBtn" @click="loginClick" :disabled=" userName==='' || password==='' || !privacyChecke">Sign in</button>
			</view>

			<view class="socialWrap" v-if="providers.length">
				<view class="socialDivider"><text>or continue with</text></view>
				<view class="socialBtns">
					<button v-for="(p,index) in providers" :key="index" class="socialBtn" :class="'socialBtn--'+p.provider" @click="openWebview(p.start_url, p.name)">{{p.name}}</button>
				</view>
			</view>

			<view class="registerWrap" v-if="registerUrl">
				<button class="registerBtn" @click="openWebview(registerUrl, 'Create account')">Create free account</button>
			</view>
			
			<view class="loginPrivacy">
				<label @click="privacy">
					<checkbox :checked="privacyChecke" /> Agree to
				</label>
				<text @click="privacyLink" class="loginPrivacyLink">privacy policy</text>
			</view>
			
		</view> 
		<view class="footLink">
			To set availability or book a chat, you can also visit our website without leaving the app:
			<view>
				<!-- <text @click="openLink(1)" class="footLinkItem">wespeakenglish.chat(Asia)</text> -->
				<text  v-for="(item,index) in urlList" :key="index" class="footLinkItem" @click="openLink(item.url)">{{item.txt}}</text> 
			</view>
			<!--<view style="text-align: center; padding: 10rpx 0 0 0;" v-if="showAgr">
				<text @click="unsubscribe()" class="unsubscribe">Unsubscribe</text> 
			</view>-->
		</view>
		
	</view>
</template>

<script>
	import { login,geturl,getSocialConfig } from '../../models/index.js'
	import scan from "../../components/scan.vue"
	export default {
		data() {
			return {
				title: 'En Chat',
				userName:'',
				password:'',
				remeberChecke:false,
				privacyChecke:true,
				nameIsCut:false,
				pwdIsCut:false,
				showAgr:false,
				urlList:[],
				providers:[],
				registerUrl:'',
			}
		},
		components: {
		  scan
		},
		onShow: function() {
			var _this = this	
			uni.getSystemInfo({
				success:(res) => {
					_this.geturlFun();
					_this.getSocialConfigFun();
					if(res.platform=="android"){ 
						_this.showAgr = true
					}else{ 
						_this.showAgr = false
					}
				},
			})	
		},
		onLoad() {
			// this.password = option.password
			// this.userName = option.email
			// this.userInfo = this.$store.state.userInfo
			// var _this = this
			// if(!this.userInfo.id&&option.email){
			// 	this.nameIsCut = true
			// 	this.pwdIsCut = true
			// 	_this.loginClick()
			// }
			var loginData = JSON.parse(uni.getStorageSync('loginData'))
			if(loginData){
				this.nameIsCut = true
				this.pwdIsCut = true
				this.userName = loginData.email
				this.password = loginData.password
			}
						
		},
		
		methods: {
			geturlFun(){
				var that=this;
				geturl().then((res) => {
					this.urlList=res.index_urls;
					uni.setStorageSync('urlList', this.urlList);
				}).catch(err => {
					//console.log(err,222222)
				})
			},
			getSocialConfigFun(){
				var that=this;
				getSocialConfig().then((res) => {
					that.providers = res.providers || [];
					that.registerUrl = res.register_url || '';
				}).catch(err => {
					//console.log(err,222222)
				})
			},
			//在 App 内嵌网页中打开网站页面（注册 / 社交登录 / 官网），用户感觉不到离开了 App
			openWebview(url, title){
				if(!url){ return; }
				uni.navigateTo({
					url: '/pages/webview/index?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title || 'WeSpeakEnglish'),
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			openLink(url){
				this.openWebview(url, 'WeSpeakEnglish');
			},
			unsubscribe(){
				console.log(22222222222222222222)
					uni.navigateTo({
						url: '/pages/login/unsubscribe',
						animationType: 'pop-in',
						animationDuration: 200
					})
			},
			privacy(){
				this.privacyChecke = !this.privacyChecke
			},
			remeber(){
				this.remeberChecke = !this.remeberChecke
			},
			scan(){
				uni.scanCode({
				    success: function (res) {
						
				    }
				});
			},
			loginClick(){			
				var _this = this
				var userData = {email:_this.userName,password:_this.password}	
					
				//记住账号密码
				if(_this.remeberChecke){	
					try{						
						uni.setStorageSync('loginData', JSON.stringify(userData));
					}catch(e){
						
					};
				}
				
				//登录
				login(userData).then((res) => {
					// uni.showToast({
					//     title: 'Log successful!' 
					// });
					uni.setStorage({
					    key: 'userInfo',
					    data: res,
					    success: function (e) {	
							_this.$store.commit("login", res)
							setTimeout(function () {							 
								uni.switchTab({
									url: '/pages/index/index'
								})
							}, 1000);
					    }
					});
				}).catch(err => {
					//console.log(err,222222)
				})
				
			},
			focusName() {
				this.nameIsCut = true
			},		
			blurName() {
		    	if (this.userName === '') {
					this.nameIsCut = false
		    	}else{
					this.nameIsCut = true
				}	
		    },			
			focusPwd() {
				this.pwdIsCut = true
			},		
			blurPwd() {
		    	if (this.password === '') {
					this.pwdIsCut = false
		    	}else{
					this.pwdIsCut = true
				}	
		    },
			privacyLink(){
				uni.navigateTo({
					url: '/pages/login/privacy',
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		}
	}
</script>



