<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config"/>		
		<view class="pageMain">
			<view class="userInfo">
				<view class="userInfoPhoto iconfont"  :class="{'iconlearner-me': userInfo.user_type==1,'icontutor-me': userInfo.user_type==2}"></view>
				<view class="userInfoPhotoName">{{userInfo.username}}</view>
			</view>			
			<button type="primary" class="outLogin" @click="outLogin">Log out</button>
			
			<navigator url="/pages/login/agreement" v-if="showAgr" class="myNav">
				<text class="iconfont iconarrow-top-copy"></text>
				User Agreement
			</navigator>
			
			<navigator url="/pages/login/privacy" v-if="showAgr" class="myNav">
				<text class="iconfont iconarrow-top-copy"></text>
				Privacy Policy
			</navigator>
			 
		</view>
		
		<view class="footLink">
			To join us, set availability or book a chat, please visit:
			<view>
				<!-- <text @click="openLink(1)" class="footLinkItem">wespeakenglish.chat(Asia)</text> 
				<text @click="openLink(2)" class="footLinkItem">wespeakenglish.net</text> -->
				<text  v-for="(item,index) in urlList" :key="index" class="footLinkItem" @click="openLink(item.url)">{{item.txt}}</text> 
			</view>
		</view>
		
	</view>
</template>

<script>
</script>
<script>
	import { logout } from '../../models/index.js'
	export default {
		data() {
			return {
				config:{
					title: 'Account',
					backgroundColor: [1, '#eaecf8'],
					back: false,
				},
				userInfo:'',
				showAgr:false,
				urlList:[],
			}
		},
		onShow: function() {
			this.util.isLogin();			
			this.userInfo = this.$store.state.userInfo;			
			this.urlList=uni.getStorageSync('urlList');	
		},
		onLoad() {
			var _this = this
			uni.getSystemInfo({
				success:(res) => {
					if(res.platform=="android"){ 
						_this.showAgr = true
					}else{ 
						_this.showAgr = false
					}
				},
			})		
		}, 
		methods: { 
			openLink(url){
				// var url = ''
				// if(type == 1){
				// 	url = 'https://www.wespeakenglish.chat'
				// }else{
				// 	url = 'https://www.wespeakenglish.net'
				// }
				plus.runtime.openURL(url, function(res) {  
					console.log(res);  
				});
			},
			test(){
				uni.navigateTo({
					url: '/pages/room/test'
				})
			},
			outLogin(){
				var _this = this
				
				logout().then((res) => {
					uni.removeStorage({
					    key: 'userInfo',
					    success: function (res) {
							console.log(res)
							_this.$store.commit("login", '')
							
							
							// uni.showToast({
							//     title: 'Log out!'
							// });
							
							setTimeout(function () {							 
								_this.util.isLogin()
							}, 1000);
					    }
					});
					
				}).catch(err => {
					//console.log(err,222222)
				})
				
				
			}
		}
	}
</script>
<style scoped>
	.footLink{
		font-size: 28rpx;
	}
</style>
