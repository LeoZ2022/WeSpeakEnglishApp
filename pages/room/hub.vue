<template>
	<view style="padding: 100px 0 0 0; text-align: center; color: #ccc;">
		loading...
	</view>
</template>

<script>
	import { login,getClassOne } from '@/models/index.js'
	
	export default {
		components: {
		},
		data() {
			return {
				classInfo:{
					id:'',
					email:'',
					password:'',
					username:'',
					class_id:''
				},
				
				userInfo:'',
				
			}
		},
		created() {
			setTimeout(function () { //  未安装的情况
				uni.switchTab({
				    url: '/pages/index/index'
				});
			}, 4000);
		},
		onLoad:function(option) {
			this.classInfo.id = option.id
			this.classInfo.email = option.email
			this.classInfo.password = option.password
			this.classInfo.username = option.username
			this.classInfo.class_id = option.class_id
			
			this.userInfo = this.$store.state.userInfo
			var _this = this
			if(this.userInfo.id){
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
		},
		onShow: function() {
			 
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
							content: 'The chat is over or invalid！',
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
		}
	}
</script>

<style>
	.lecture_text {
		overflow: hidden;
	}

	.lecture_img {
		width: 100%;
	}

	.lecture_title {
		white-space: nowrap;
		text-overflow: ellipsis;
		padding-bottom: 10px;
	}

	.lecture_location,
	.lecture_date {
		line-height: 20px;
		font-size: 12px;
		color: #AAAAAA;
	}
</style>

