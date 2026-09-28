<script>
	import { config } from '@/config.js'
	export default {
		onLaunch: function() {
			//#ifdef APP-PLUS
			//	this.AndroidCheckUpdate();  disable update check 20221020 per 360 request. 12-05 打包上架应用宝
			//#endif
			
			plus.screen.lockOrientation('portrait-primary');
		},
		onShow: function() {
			//this.util.isLogin()
			this.clearBadge()
			var _this = this
			setTimeout(() => {
				
				
				let appOpenParam = plus.runtime.arguments
				  plus.runtime.arguments = null;
				  plus.runtime.arguments = "";
				  appOpenParam = appOpenParam.replace("wespeakenglish:/",'')
				  appOpenParam = decodeURIComponent(appOpenParam)
				  if (appOpenParam && appOpenParam.trim().length>0) {
				    if (appOpenParam) {
						uni.setStorageSync('storage_email',_this.getQueryVariable('email',appOpenParam));
						uni.setStorageSync('storage_password',_this.getQueryVariable('password',appOpenParam));
						uni.switchTab({
							url: appOpenParam,
							animationType: 'none',
						});
						  
				    }
				  }
				
				
				// //获取第三方传来的参数
				// let args = plus.runtime.arguments
				// console.log('args:', args)
				// if (args) {
				// 	//对传来的参数做处理并跳转
				// 	let arg=args.split(":/")
				// 	uni.navigateTo({
				// 		url:arg[1]
				// 	})
				// 	// console.log(args)
				// 	// 处理args参数，如直达到某新页面等  
				// }
			}, 0);

		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			getQueryVariable(variable,url){
			   var vars = url.split("&");
			   for (var i=0;i<vars.length;i++) {
				   var pair = vars[i].split("=");
				   if(pair[0] == variable){return pair[1];}
			   }
			   return(false);
			},
			clearBadge() {
				plus.runtime.setBadgeNumber(0);
			},
			AndroidCheckUpdate(){
				var version = plus.runtime.version
				console.log(version,'version----')
				uni.request({
					url: config.base_url+'/api/index/get_upgrade',
					success: (res) => {
						var androidData = res.data.data.android
						var iosData = res.data.data.ios
						
						console.log(res)
						uni.getSystemInfo({
							success:(r) => {
								//检测当前平台，如果是安卓则启动安卓更新  
								if(r.platform=="android"){  
									if(version != androidData.version){
										//var fileUrl = config.base_url+'/public/'+androidData.apk
										var fileUrl = 'https://wespeakenglish.net/EnChat.apk'
										console.log(config.base_url+'/public/'+androidData.apk,'---------')
										uni.showModal({ //提醒用户更新  
											title: "New version available",
											//cancelText: 'Skip',
											cancelText: 'I know',
											confirmText: 'Update',
											//content: androidData.descr,
											content: 'Find it in Google Play & App Stores. Or update from our server?',
											success: (s_res) => {
												if (s_res.confirm) {
													console.log(s_res,'确定---')
													
													uni.showLoading({
														title: 'Updating'
													})
													
													uni.downloadFile({//执行下载
													        url: fileUrl, //下载地址
													        success: downloadResult => {//下载成功 
															uni.hideLoading();
															console.log('d-----------')
													            if (downloadResult.statusCode == 200) {
													                uni.showModal({
													                    title: '',
													                    content: 'Update successful. Are you sure to restart now？',
													                    confirmText: 'Restart',
													                    success: function(e) {
													                        if (e.confirm == true) {
													                            plus.runtime.install(//安装
													                                downloadResult.tempFilePath, {
													                                    force: true
													                                },
													                                function(res) {
													                                    utils.showToast('Update successful. Restarting...');
													                                    plus.runtime.restart();
													                                }
													                            );
													                        }
													                    }
													                });
													            }else {  
																	 uni.showToast({  
																		title: 'Update failed!',
																		duration: 1500  
																	 });  
																}
													        },
															
													    });
													
													
												}
											}
										})
									}
								}else{
									
									if(version != iosData.version){
										
										uni.showModal({ //提醒用户更新  
											title: "En Chat",
											cancelText: 'I know',
											confirmText: 'Update',
											//content: iosData.descr,
											content: 'New version available. Update now?',
											success: (s_res) => {
												console.log('ios-----')
												if (s_res.confirm) {
													plus.runtime.launchApplication({
														action: `itms-apps://itunes.apple.com/cn/app/id${iosData.appleId}?mt=8`
													}, function(e) {
														console.log('Open system default browser failed: ' + e.message);
													});
													
												}
											}
										})
									}
									
									
								}
								
								
								
							}  
						})
						
						
						
						
					}
				})
			}
		}
		
	}
</script>

 
<style>
	@import "@/uni_modules/hx-navbar/components/hx-navbar/iconfont.css";
	@import url("@/static/iconFont/iconfont.css");
	body{
		background: #fafafa;
	}

  .dotContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 10rpx;
    transform: translateY(-50%);
    width: 20rpx;
    height: 20rpx;
    margin-right: 5rpx;
  }

  .dotConfirmed {
    width: 15rpx;
    height: 15rpx;
    border-radius: 50%;
    background-color: green;
  }

/*  .dotUnconfirmed {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background-color: rgba(78, 61, 55, .5);
  } */
.dotContainerUpcoming {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20rpx;
  margin-right: 10rpx;
}

	.navFixLine{
		position: fixed; 
		width: 750rpx;
		height: 1px;
		overflow: hidden;
		border-bottom:1px solid #e4e7f1;
		bottom:100px;
		z-index: 999;
		display: block;
		content: '';
		bottom: var(--status-bar-height); 
	} 
	 
	uni-tabbar .uni-tabbar .uni-tabbar-border {
		background-color: #e4e7f1!important;
	}
	.uni-tabbar-border {
		background-color: #e4e7f1!important;
	}
	.loginLogo{
		width: 310rpx;
		height: 300rpx; 
	}
	.loginHead{
		padding: 40rpx 0 15rpx 0;
		text-align: center;
	}
	.loginMain{
		padding:0 80rpx;
	}
	.loginForm{
		position: relative;
	}
	.loginForm .uni-input-input{
		border: none;
		border-bottom: 1px solid #f2f2f2;
		background: none;
		width: 100%;
		height: 66px;  
		line-height: 30px;
		padding: 20px 0 10px 0;
		box-sizing: border-box;
		color: #4e3d37;
		font-size: 18px;
	}
	.loginForm .uni-input-input:focus{
		border-bottom:1px solid #5d73bc;
	}
	.loginForm.active .loginFormText{
		top: 14rpx;
		color: rgba(78,61,55,1);
	}	
	.loginFormText{		
		height: 20px;
		line-height: 20px;
		font-size: 14px;
		color: rgba(78,61,55,.7);
		opacity:.7;
		position: absolute;
		left: 0;
		top: 56rpx;
		-webkit-transition:0.2s ease-in 0s;
		       -o-transition:0.2s ease-in 0s;
		          transition:0.2s ease-in 0s;
	}
	.loginTool{
		text-align: right;
		padding: 80rpx 30rpx 0 0;
	}
	.loginCheckbox{
		color: #a39d9b;
		font-size: 28rpx;
		line-height: 32rpx;
		padding: 50rpx 0 0 0;
	}
	.loginCheckbox uni-checkbox .uni-checkbox-input{
		border-radius: 32rpx;
		width: 32rpx;
		height: 32rpx;
		margin-top: -4rpx;
	}
	.loginCheckbox uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before{
		font-family: "iconfont";
		content: "\e621";
		font-weight: bold;
		color: #fff;
		font-size: 34rpx;
	}
	.loginCheckbox uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
		background: #5d73bc;
		border-color: #5d73bc;
	}
	.loginCheckboxText{
		float: right;
		color: #5d73bc;
		font-size: 28rpx;
	}
	uni-button.loginBtn{
		font-size: 32rpx;
		font-weight: bold;
		background: #5d73bc;
		line-height: 100rpx;
		border-radius: 10rpx;
	}
	uni-button[disabled].loginBtn{
		background: #dfdddc;		
	}
	uni-button[disabled].loginBtn:after{
		border-color: #dfdddc;
	}
	.loginFoot{
		padding: 50rpx 0 0 0;
	}
	
	
	.loginPrivacy{
		padding: 60rpx 0 0 0;
		text-align: center;
		font-size: 28rpx;
		color: #918986;
	}
	
	.loginPrivacy uni-checkbox .uni-checkbox-input{
		border-radius: 32rpx;
		width: 32rpx;
		height: 32rpx;
		margin-top: -4rpx;
	}
	.loginPrivacy uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before{
		font-family: "iconfont";
		content: "\e621";
		font-weight: bold;
		color: #5d73bc;
		font-size: 34rpx;
	}
	.loginPrivacy uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked{
		background: #fff;
		border-color: #5d73bc;
	}
	.loginPrivacyLink{
		text-decoration: underline;
		display: inline-block;
		margin-left: 10rpx;
	}
	.header{
		overflow: hidden;
		position: fixed;
		left: 0;
		right:0;
		top: 0;
		z-index: 99999;
		height: 100rpx;
		background: #fff;
	}
	.headRight{
		position: absolute;
		right: 0;
		top: 0;
		padding: 15rpx 30rpx 0 0;
	}
	.headUser{
		color: #4e3d37;
		font-size: 36rpx;
		line-height: 100rpx;
		padding: 0 0 0 116rpx;
		position: relative;
		font-weight: bold;
	}
	.headUser .iconfont{
		font-size: 42rpx;
		position: absolute;
		left: 30rpx;
		top: 14rpx;
		width: 70rpx;
		height: 70rpx;
		border-radius: 100%;
		background: #eaecf4;
		color: #5d73bc;
		text-align: center;
		line-height: 70rpx;
	}
	.pageMain{
		padding: 30rpx;
	}
	.textBox{
		font-size: 30rpx;
		color: #4e3d37;
		line-height: 180%;
	}
	.borderInput{
		position: relative;
		border: 1px solid #eeeceb;
		border-radius: 10rpx;
		margin: 40rpx 0 0 0;
	}
	.borderInput .iconfont{
		position: absolute;
		right: 0;
		top:0;
		font-size: 48rpx;
		color: #c5c1c0; 
		height: 100rpx;
		width: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-weight: bold;
	}
	.borderInputText{
		line-height:60rpx;
		height: 60rpx;
		padding: 20rpx;
		font-size: 32rpx;
		color: rgba(78,61,55,.5);
	}
	
	.roomBox {
		background: #f2f3f8;
		border-radius: 10rpx;
		overflow: hidden;
		position: relative;
	}
	
	.roomBox::after {
		width: 1px;
		display: block;
		content: '';
		position: absolute;
		left: 160rpx;
		top: 20rpx;
		bottom: 20rpx;
		background: #e4e5e9;
	}
	
	.roomBoxLeft{
    width: 160rpx;
    float: left;
    text-align: center;
    font-size: 26rpx;
    color: rgba(78, 61, 55, .5);
    font-weight: 500;
	margin-right: 1rpx;
	}
		.roomBoxLeftTime {
			
		margin-top: 0.5rem;	
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		}
	
	.searchList .roomBoxLeft b{
		padding: 5rpx 0 0 0;
	}
	.searchList .roomBoxLeft{
		padding: 20rpx 0 15rpx 0;
	}
	.searchList .roomBoxMain{
		margin-top: 8rpx;
	}
	.searchList .roomBoxId{
		padding: 5rpx 0 0 0;
	}
	.searchList .roomBoxRight {
		padding: 30rpx 0 ;
	}
	.searchList .roomBoxCountdown{
		padding: 6rpx 0;
	}
	.roomBoxLeftMonth{
		font-size: 26rpx;
		color: rgba(78,61,55,.7);
		line-height: 26rpx;
		display: none;
	}
	.roomBoxLeftWeek{
		font-size: 26rpx;
		color: rgba(78,61,55,.7);
		line-height: 26rpx;
		padding: 5rpx 0 0 0;
		display: none;
	}
	.searchList .roomBoxLeftMonth,
	.searchList .roomBoxLeftWeek{
		display: block;
	}
	.roomBoxLeftMonthText{
		display: inline-block;
		padding: 0 7rpx;
		color: #4e3d37;
	}
	.roomBoxLeft b {
		display: block;
		font-size: 38rpx;
		color: #4e3d36;
		font-weight: bold;
		padding: 30rpx 0 0 0;
	}
	
	.roomBoxMain { 
		margin: 0 160rpx 0 190rpx;
		font-size: 26rpx;
		padding: 20rpx 0 0 0;
		line-height: 160%;
	}
	
	.roomBoxId {
		color: rgba(78,61,55,.5);
		font-weight: 500;
		padding-bottom: 5rpx;
	}
	
	.roomBoxId span {
		color: #4c3d3a;
	}
	
	.roomBoxRight {
		float: right;
		text-align: center;
		width: 160rpx;
		background: #e2e6f2;
		font-size: 24rpx;
		padding: 20rpx 0;
		line-height: 160%;
	}
	
	.roomBoxState {
		color: rgba(78,61,55,.6);
	}
	
	.roomBoxTime {
		color: #4e3c3a;
	}
	
	.roomBoxEnter {
		color: rgba(78,61,55,.25);
	}
	
	.roomBoxName {
		font-size: 30rpx;
	}
	
	.roomList {
		padding: 20rpx 0 0 0;
	}
	
	.roomPad {
		margin-bottom: 30rpx;
	}
	
	.roomPad:last-child {
		margin: 0;
	}
	.roomBox.wait .roomBoxLeft b {
		color: #64a36e;
	}
	
	.roomBox.wait {
		background: #ebf1ed;
	}
	
	.roomBox.wait .roomBoxRight {
		color: #fff;
		background: #65a46d;
	}
	
	.roomBox.ongoing .roomBoxLeft b {
		color: #e7727a;
	}
	
	.roomBox.ongoing {
		background: #f9eff0;
	}
	
	.roomBox.ongoing .roomBoxRight {
		color: #fff;
		background: #e9727a;
	}
	
	.roomBox.ongoing .roomBoxState,
	.roomBox.ongoing .roomBoxCountdown,
	.roomBox.ongoing .roomBoxEnter {
		color: #fff;
	}
	
	
	
	.roomBox.wait .roomBoxState,
	.roomBox.wait .roomBoxCountdown,
	.roomBox.wait .roomBoxEnter {
		color: #fff;
	}
	
	.tabNavItem {
		float: left;
		width: 50%; 
		color: #b0aca9;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.tabNavItem span {
		font-size: 24rpx;
	}
	
	.tabNavItem.active {
		color: #4e3d36;
	}
	
	.tabNav {
		padding: 40rpx 0 0 0;
		overflow: hidden;
	}
	.panelHeader{
		overflow: hidden;
		position: relative;
	}
	.panelHeader::after{
		width: 1px;
		display: block;
		content: '';
		top: 30rpx;
		bottom: 30rpx;
		left: 160rpx;
		background: rgba(0,0,0,.05);
		position: absolute;
	}
	.panelHeader::before{
		font-family: "iconfont" !important;
		font-size: 32rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		content: "\e625";
		position: absolute;
		right: 26rpx;
		top: 50%;
		color: #4e3d37;
		transform: translateY(-50%);
		font-size: 32rpx;
		-webkit-transition:0.3s ease-in 0s;
		       -o-transition:0.3s ease-in 0s;
		          transition:0.3s ease-in 0s;
	}
	.panelList.active .panelHeader::before{
		transform:rotate(180deg); 
		margin-top: -10rpx;
	}
	.panelHeaderLeft{
		float: left;
		width: 160rpx;
		text-align: center;
		padding: 30rpx 0;
	}
	.panelList{
		background: #f3f3f3;
		border: 1px solid #f3f3f3;
		border-radius:10rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}
	.panelList.active{
		background: #fff;
		border: 1px solid #eee;
	}
	.panelHeaderLeftNum{
		font-size: 42rpx;
		font-weight: bold;
	}
	.panelHeaderLeftMonth{
		font-size: 28rpx;
		font-weight: bold;
	}
	.panelHeaderLeftPeriod{
		font-size: 26rpx;
		font-weight: 400;
		color: rgba(78,61,55,.5);
	}
	.panelHeaderMain{
		margin-left: 200rpx;
		padding: 30rpx 40rpx 30rpx 0;
		line-height: 180%;
	}
	.panelHeaderMainText{
		font-size: 32rpx;
		font-weight: 200;
		line-height: 40rpx;
	}
	.panelHeaderMainTextItem{
		display: inline-block;
		margin-right: 10rpx;
		padding: 0 25rpx 0 0;
		position: relative;
		line-height: 40rpx;
		color: rgba(78,61,55,1);
		font-size: 26rpx;
	} 
	.panelHeaderMainTextItem::after{
		content: '-';
		position: absolute;
		display: block;
		right: 0;
		top: -2rpx;
		line-height: 24prx;
		font-size: 20rpx;
	}
	.panelHeaderMainTextItem:last-child::after{
		display: none;
	}
	.panelHeaderMainTop{
		color: #bab5b4;
		font-weight: 300;
		font-size: 32rpx;
	}
	.panelHeaderMainTop b{
		display: inline-block;
		margin-right: 10rpx;
		color: #4f3c38;
		font-weight: bold;
	}
	.panelHeaderMainTop span{
		color: rgba(78,61,55,.5);
		font-size: 26rpx;
		display: inline-block;
		margin-left: 20rpx;
	}
	.panelListBox{
		border-top: 1px solid rgba(0,0,0,.05);
		overflow: hidden;
		padding: 30rpx 0;
	}
	.panelMain{
		padding: 0 30rpx;
		display: none;
	}
	.panelList.active .panelMain{
		display: block;
	}
	.panelListBoxRight{
		float: right;
		background: #e2e6f2;
		border-radius: 10rpx;
		text-align: center;
		padding: 15rpx 0;
		width: 220rpx;
		font-size: 24rpx;
		line-height: 160%;
	}

		.panelListBoxMain{
			margin: 0 220rpx 0 0;
		}
		
		.panelListState{
			color: #959094;
		}
		.panelListCountdown{
			color: #4f3c38;
			padding: 5rpx 0;
		}
		.panelListEnter{
			color: rgba(78,61,55,.25);
		}
		.panelListName{
			font-size: 32rpx;
			font-weight: 400;
			color: #4e3d36;
		}
		.panelListTime{
			font-weight: bold;
			color: #4e3d37;
			font-size: 32rpx;
			font-weight: 400;
		}
	.panelListTime b{
		display: inline-block;
		padding-right: 20rpx;
	}
	.panelListId{
		color: rgba(78,61,55,.5);
		font-weight: 400;
		font-size: 26rpx;
	}
	.panelListId span{
		color: rgba(78,61,55,1);
	}
	.quickSearchTitle{
		font-size: 32rpx;
		color: #4e3d37;
		font-weight: bold;
		padding: 80rpx 0 10rpx 0;
	}
	.quickSearchTitle b{
		display: inline-block;
		padding: 0 10rpx;
	}
	.userInfoPhoto{
		width: 160rpx;
		height: 160rpx;
		border-radius: 100%;
		background: #eaecf4;
		color: #5d73bc;
		line-height: 160rpx;
		font-size: 100rpx;
		margin: 0 auto;
	}
	.userInfo{
		text-align: center;
		padding: 100rpx 0 0 0;
	}
	.userInfoPhotoName{
		font-size: 52rpx;
		color: #4e3d37;
		padding: 30rpx 0 0 0;
		font-weight: bold;
	}
	uni-button.outLogin,
	.outLogin{
		margin: 60rpx 0 0 0;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		border: 1px solid #5d73bc;
		border-radius: 14rpx;
		color: #5d73bc;
		background-color: #fff;
		height: 100rpx;
		line-height: 100rpx;
		margin-bottom: 50rpx;
	}
	.borderInput .code{
		width: 182rpx;
		height: 60rpx;
		position: absolute;
		right: -6rpx;
		top: 28rpx;		
		z-index: 999; 
	}
	.panelEndListBox{
		width: 50%;
		float: left;
	}
	.panelEndListPad{
		background: #f7f5f3;
		border-radius: 10rpx;
		padding: 15rpx 20rpx;
		margin: 0 0 30rpx 30rpx;
	}
	.panelEndList{
		overflow: hidden;
		margin-left: -30rpx;
		font-weight: 400;
	}
	.panelEndListName{
		color: rgba(78,61,55,.8);
		font-size: 32rpx;
		padding: 10rpx 0 0 0;
	}
	.panelEndListTime{
		color: rgba(78,61,55,.8);
		font-size: 26rpx;
		overflow: hidden;
		padding: 5rpx 0 0 0;
	}
	.panelEndListText{
		color: rgba(78,61,55,.5);
		float: right;
	}
	.reportBtn{
		background: rgba(0,0,0,.3);
		color: #fff;
		border-radius: 0 30rpx 30rpx 0;
		position: fixed;
		left: 0;
		top: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		z-index: 99999;
		font-size: 24rpx;
		color: #ccc;
	}
	.myNav{
		display: block;
		background: #f3f4f9;
		position: relative;
		border-radius: 8rpx;
		font-size: 32rpx;
		color: #5d73bc;
		margin-top: 20rpx;
		padding: 0 0 0 30px;
		line-height: 100rpx;
	}
	.myNav .iconfont{
		font-size: 32rpx;
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
	}
	.footLink{
		text-align: center;
		font-size: 28rpx;
		color: rgba(78,61,55,.7);
		padding: 60rpx 0 0 0;
		line-height: 40rpx;
	}
	.footLinkItem{
		display: inline-block;
		padding: 0 30rpx;
		text-decoration: underline;
		font-style: oblique;
		color: #5d73bc;
	}
	.unsubscribe{
		color: rgba(78,61,55,.7);
		text-decoration: underline;
		font-style: oblique;
	}
</style>