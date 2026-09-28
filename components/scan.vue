<template>
	<view>
		<text @click="scan" class="iconfont iconscan-bold"></text>
	</view>
</template>

<script>
	import { login,getClassOne } from '@/models/index.js'
	export default {
		data() {
			return {
				classInfo:'',
				userInfo:''
			}
		},
		props: {
		   scanType:{
			   type: Number,
			   default: 1,
			   //1为默认app内扫描，可不传；2为登录
		   }
		}, 
		created() {
			this.userInfo = this.$store.state.userInfo
		},
		methods: {
			goLink(){
				var _this = this
				getClassOne(_this.classInfo.class_id).then((res) => {
					if(res.order_status == 1){
						var date = res.datetime - res.now_time
						if(date>300){
							uni.navigateTo({
							    url: '/pages/room/noStart?roomId='+_this.classInfo.class_id+'&userType='+_this.userInfo.user_type,
							    animationType: 'pop-in',
							    animationDuration: 200
							});
						}else{
							uni.navigateTo({
							    url: '/pages/room/index?roomId='+_this.classInfo.class_id+'&userType='+_this.userInfo.user_type,
							    animationType: 'pop-in',
							    animationDuration: 200
							});
						}
					}else{
						uni.showModal({
							title: 'En Chat',
							content: 'The chat has ended or is invalid！',
							showCancel: false,
							confirmText: 'Confirm',
							success: function(res) {
								if (res.confirm) {
									
								}
							}
						});
					}
				})
				
			},
			login(){
				var _this = this
				
				var userData = {email:_this.classInfo.email,password:_this.classInfo.password}
				console.log(userData,'userData-------')
				login(userData).then((res) => {
					console.log(res,'login-----------')
					
					uni.removeStorage({
					    key: 'userInfo',
					    success: function (res) {
							console.log(res)
							_this.$store.commit("login", '')
					    }
					});
					uni.showToast({
					    title: 'Login successfully!'
					});
					uni.setStorage({
					    key: 'userInfo',
					    data: res,
					    success: function (e) {	
							_this.$store.commit("login", res)
							_this.userInfo = _this.$store.state.userInfo
							_this.goLink()
					    }
					});
				}).catch(err => {
					//console.log(err,222222)
				})
			},
			scan(){
				
				uni.showToast({
					duration: 5000,
					icon:'none',
				    title: 'Make sure En Chat can access the camera.'
				});
				
				var _this = this
				uni.scanCode({
				    success: function (res) {  
						
						var isClassQrCode = res.result.split("?")
						console.log(res) 
						var data = ''
						// 扫描了正确的课程二维码
						if(isClassQrCode[0] == 'https://www.wespeakenglish.chat/app.html'){
							
							var str = isClassQrCode[1]
							var strNew = str.replace(/=/g,':')
							var newJson = strNew.split("&")
							var classInfo = {}
							console.log(str) 
							for(var i = 0; i < newJson.length; i ++){
								var newData = newJson[i].split(":")
								var k = newData[0]
								var v = newData[1]
								classInfo[k] = v
							}
							
							_this.classInfo = classInfo
							
							//已登陆扫描
							if(_this.scanType == 1){ 
								//课程二维码与当前登录用户对应
								console.log(_this.userInfo.id,'_this.userInfo.id----------')
								console.log(_this.classInfo.id,'_this.classInfo.user.id----------')
								
								if(_this.$store.state.userInfo.id == _this.classInfo.id){
									_this.goLink() 
								}else{
									//课程二维码与当前登录用户不对应，提示是否登录当前课程账号
									uni.showModal({
										title: 'En Chat',
										content: 'This is not your chat. Do you want to log in as "'+ _this.classInfo.username +'" to start the chat?',
										cancelText: 'No',
										confirmText: 'Yes',
										success: function(res) {
											if (res.confirm) {
												
												_this.login()
											}
										}
									});
								}
								
							}else{
								//登录页面扫描
								 _this.login()
							}
							
						}else{
							uni.showModal({
								title: 'En Chat',
								content: 'Invalid QR code!',
								showCancel: false,
								confirmText: 'Confirm'
							});
						} 
						
				    },
					fail: function(err) {
						console.log('Sweep code failure！', err)
					}
				});
			}
		}
	}
</script>

<style>
.iconscan-bold{
	font-size: 52rpx; 
	color: #3c2612; 
}
</style>
