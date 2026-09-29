<!--added confirm dot 20230819-->
<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config">
			<block slot="left">
				<view class="left" v-if="!isGuest">
					<view class="headUser">
						<text class="iconfont icontutor-me" :class="{'iconlearner-me': userInfo.user_type==1,'icontutor-me': userInfo.user_type==2}"></text>
						{{userInfo.username}}
					</view>
				</view>
			</block>
			<block slot="right">
				<view class="right" v-if="!isGuest">
					<view class="headRight">
						<text v-if="homeUrl" class="webLink" @click="openWebview(homeUrl, 'WeSpeakEnglish')">Website</text>
						<scan></scan>
					</view>
				</view>
			</block>
		</hx-navbar> 
		<view v-if="isGuest" class="welcome">
			<image src="../../static/logo.png" class="welcomeLogo"></image>
			<view class="welcomeTitle">Conversation brings us closer</view>
			<view class="welcomeDesc">Practice English with native speakers over video chat &#8212; or volunteer as a tutor and help learners around the world.</view>
			<view class="welcomeBtns">
				<button type="primary" class="welcomeBtn" @click="goLogin">Sign in</button>
				<button v-if="registerUrl" class="welcomeBtn welcomeBtn--ghost" @click="openWebview(registerUrl, 'Create account')">Create free account</button>
			</view>
			<view v-if="homeUrl" class="welcomeLink" @click="openWebview(homeUrl, 'WeSpeakEnglish')">Explore the website</view>
		</view>
		<view class="listRoom" v-else>			
			<view>
			  <span style="display: flex; align-items: center; justify-content: space-between;">
			    <span class="titleText" style="display: inline-block;">
			      TIMETABLE
			    </span>
			    <span style="display: flex; align-items: center;">
				  <span style="display: inline-block; font-size: 0.75rem;margin-right: 3.5rem;">
			        Today <b style="margin-left: 0.3rem; margin-right: 0.3rem;">{{todayLeng}}</b> chat<i style="font-size: 0.6rem; font-style: normal;">(</i>s<i style="font-size: 0.6rem; font-style: normal;">)</i>
			      </span>
			      <view style="width: 0.45rem; height: 0.45rem; background-color: green; border-radius: 50%; margin-right: 0.1rem;"></view>
			      <span style="font-size: 0.75rem; margin-right: 0.25rem;">Tutor confirmed</span>
			    </span>
			  </span>
			</view>

			<view v-if="todayLeng==0" style=" padding: 30rpx; color: #ccc; height: 100rpx; line-height: 100rpx; text-align: center;">No chat</view>
			<view class="roomList" v-else>
				<view v-for="(item,index) in roomList" :key="index" class="roomPad">
					<roomlist :classInfo="item" :nowTime="nowTime"></roomlist>
				</view>
			</view>

			<view class="tabNav">
				<view class="tabNavItem" @click="tabNavClick(index)" :class="{'active':tabCut==index}"
					v-for="(item,index) in tabNav">{{item.name}}<span>（{{item.num}})</span></view>
			</view>
			<view class="roomList" v-if="tabCut==0">
				<view class="panelList" v-for="(item,index) in uocomingList" :key="index" :class="{'active': item.show}">
					<view class="panelHeader" @click="upcomingOpen(index)">
						<view class="panelHeaderLeft">
							<view class="panelHeaderLeftNum">{{item.day}}</view>
							<view class="panelHeaderLeftMonth">{{item.month}}</view>
							<view class="panelHeaderLeftPeriod">{{item.week}}</view>
						</view>
						<view class="panelHeaderMain">
							<view class="panelHeaderMainTop"><b>{{item.chatLeng}}</b> chat<i style="font-size: 22rpx; font-style: normal;">(</i>s<i style="font-size: 22rpx; font-style: normal;">)</i></view>
							<view class="panelHeaderMainText" v-html="item.userName"></view>
						</view>
					</view>
					<view class="panelMain">
						<view class="panelListBox" v-for="(list,j) in item.lists" :key="j">
							<view class="panelListBoxRight">
								<view class="panelListState">Upcoming</view>
								<view class="panelListCountdown"><countdown :st="nowTime" :et="list.datetime"></countdown></view>
								
							</view>
							<view class="panelListBoxMain">
							  <view style="display: flex; align-items: center;">
								<view class="dotContainerUpcoming">
								  <view v-if="list.confirmed == 1" class="dotConfirmed"></view>
								</view>
								<view style="flex: 1;">
								  <view class="panelListName">{{list.username}}</view>
								  <view class="panelListTime">
									<block v-if="userInfo.user_type == 1">
									  <b>
										{{util.dateTonum(list.time_begin)}} - {{util.dateTonum(list.time_end)}} {{util.timeFrame(list.time_begin)}}
									  </b>
									</block>
									<block v-else>
									  <b>
										{{util.dateTonum(list.time_begin_teacher)}} - {{util.dateTonum(list.time_end_teacher)}} {{util.timeFrame(list.time_begin_teacher)}}
									  </b>
									</block>
								  </view>
								  <view class="panelListId">Room ID:<span>{{list.classin_id}}</span></view>
								</view>
							  </view>
							</view>
							
						</view>
					</view>
				</view>
				
				<loadmore :status="uocomingStatus" :icon-size="16" :content-text="contentText" style="margin-bottom: 40rpx;"></loadmore>
			
			</view>
			
			<view class="roomList"  v-if="tabCut==1">
				<view class="panelList" v-for="(item,index) in finishedList" :key="index" :class="{'active': item.show}">
					<view class="panelHeader" @click="finishedOpen(index)">
						<view class="panelHeaderLeft">
							<view class="panelHeaderLeftNum">{{item.day}}</view>
							<view class="panelHeaderLeftMonth">{{item.month}}</view>
							<view class="panelHeaderLeftPeriod">{{item.week}}</view>
						</view>
						<view class="panelHeaderMain">
							<view class="panelHeaderMainTop"><b>{{item.chatLeng}}</b> chat <i style="font-size: 20rpx; font-style: normal;">(</i>s<i style="font-size: 20rpx;font-style: normal;">)</i> <span>Finished</span></view>
							<view class="panelHeaderMainText" v-html="item.userName"></view>
						</view>
					</view>
					<view class="panelMain">
						<view class="panelEndList">
							<view class="panelEndListBox" v-for="(list,j) in item.lists" :key="j">
								<view class="panelEndListPad">
									<text class="panelEndListName">{{list.username}}</text>
									<view class="panelEndListTime">
										<block v-if="userInfo.user_type == 1">
											<text class="panelEndListText">{{util.timeFrame(list.time_begin)}}</text>{{util.dateTonum(list.time_begin)}} - {{util.dateTonum(list.time_end)}}
										</block>
										<block v-else>
											<text class="panelEndListText">{{util.timeFrame(list.time_begin_teacher)}}</text>{{util.dateTonum(list.time_begin_teacher)}} - {{util.dateTonum(list.time_end_teacher)}}
										</block>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- <loadmore :status="finishedStatus" :icon-size="16" :content-text="contentText" style="margin-bottom: 40rpx;"></loadmore> -->
				<view style="height: 40rpx;"></view>
			</view>
			
		</view>



	</view>
</template>

<script> 
	import scan from "../../components/scan.vue"
	import roomlist from "../../components/roomlist.vue"
	import { classList,setPushId,getSocialConfig } from '../../models/index.js'
	import loadmore from '@/components/uni-load-more.vue'
	import countdown from '@/components/countdown.vue'
	import { login } from '../../models/index.js'
	export default {
		data() {
			return {
				scanType:1,
				userInfo:'',
				classInfo:{
					id:'',
					email:'',
					password:'',
					username:'',
					class_id:''
				},
				config: {
					// 设置中间插槽标题将失效
					title: 'WeSpeakEnglish',
					// 取消返回
					back: false,

					leftSlot: true,
					leftSlotSwitch: true,
					centerSlot: true,
					centerSlotSwitch: true,
					rightSlot: true,
					rightSlotSwitch: true,
					// 使用插槽还是能添加btn按钮
					rightButton: false,
					backgroundColor: [1, '#eaecf8']
				},
				roomList: [],
				tabNav: [{
						name: 'UPCOMING',
						num: 0
					},
					{
						name: 'FINISHED',
						num: 0
					}
				],
				tabCut: 0,
				panelActive:false,
				nowTime:'',
				todayLeng:'',
				
				upcomingPage:1,
				// finishedPage:1,
				
				uocomingList:[],
				finishedList:[],
				
				uocomingStatus: 'more',
				// finishedStatus: 'more',
				contentText: {
					contentdown: 'Pull up to load more',
					contentrefresh: 'Loading...',
					contentnomore: 'No more'
				},
				pageSize:8,
				// stopFinishedGet:false,
				stopUocomingGet:false,
				todayInterval:'',
				oldUserId:'',
				cid:'',
				//未登录时显示欢迎页（App 已融合网站，不再强制跳登录页）
				isGuest:false,
				registerUrl:'',
				homeUrl:''
			}
		},
		components: {
			scan,
			roomlist,
			loadmore,
			countdown
		},
		
		onShow:function() {			
			this.init();
		},
		onHide: function() {
			clearInterval(this.todayInterval);	
		},
		onLaunch: function() {
			 
		},
		onLoad(option) {
			 // #ifdef APP-PLUS
			 var pinf = plus.push.getClientInfo();
			 var cid = pinf.clientid; //客户端标识
			 this.cid = cid
			 
			 // #endif
			 
			 
		},
		onUnload() {  
			 
		},
		methods: { 
			async init(){
				this.userInfo = this.$store.state.userInfo || uni.getStorageSync('userInfo')
				if ((this.userInfo && this.userInfo.id) || uni.getStorageSync('storage_password')) {
					this.isGuest = false
					if (this.userInfo && this.userInfo.id && !uni.getStorageSync('storage_password')) {
						this.isLogin();
					} else {
						await this.login(uni.getStorageSync('storage_email'), uni.getStorageSync('storage_password'))
						//自动登录失败则回落到欢迎页
						this.userInfo = this.$store.state.userInfo
						if (!this.userInfo || !this.userInfo.id) {
							this.isGuest = true
							this.getSocialConfigFun()
						}
					}
				} else {
					//未登录：显示欢迎页，提供登录 / 注册（内嵌网站）入口
					this.isGuest = true
					this.getSocialConfigFun()
				}
			},
			getSocialConfigFun(){
				var _this = this
				getSocialConfig().then((res) => {
					_this.registerUrl = res.register_url || ''
					_this.homeUrl = res.home_url || ''
				}).catch(err => {})
			},
			goLogin(){
				uni.navigateTo({
					url: '/pages/login/index',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			//在 App 内嵌网页中打开网站页面，用户感觉不到离开了 App
			openWebview(url, title){
				if(!url){ return; }
				uni.navigateTo({
					url: '/pages/webview/index?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title || 'WeSpeakEnglish'),
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			isLogin(){
				
				this.util.isLogin()
				this.userInfo = this.$store.state.userInfo
				
				
					
				this.oldUserId = this.userInfo.id
				
				
				console.log('cid：' + this.cid);
				if(this.userInfo.id){
					setPushId(this.cid).then((res) => {
						console.log(res,'registerID get')
					})
				}
				
				
				//今天的课程
				this.getToday()
				this.todayInterval = setInterval(function(){
					_this.getToday()
				},500000)
				
				//过去的
				plus.navigator.setFullscreen(false);
				
				
				this.uocomingList = []
				this.finishedList = []
				this.tabNav[0].num = 0
				this.tabNav[1].num = 0
				this.stopUocomingGet = false
				this.stopFinishedGet = false
				this.getUpcoming()
				this.getFinished()
			},
			login(email,password){
				var _this = this
				var userData = {email:email,password:password}
				login(userData).then((res) => {							
					uni.removeStorage('storage_email');
					uni.removeStorage('storage_password');
					uni.removeStorage({
					    key: 'userInfo',
					    success: function (res) {
							console.log(res)
							_this.$store.commit("login", '')
					    }
					});
					// uni.showToast({
					//     title: 'Login successfully!'
					// });
					uni.setStorage({
					    key: 'userInfo',
					    data: res,
					    success: function (e) {	
							_this.$store.commit("login", res)
							_this.userInfo = _this.$store.state.userInfo;
							_this.isLogin();
					    }
					});
				}).catch(err => {
					uni.removeStorage('storage_email');
					uni.removeStorage('storage_password');
					//console.log(err,222222)
				})
			},
			tabNavClick(i) {
				
				this.tabCut = i
				if(this.tabCut==0){
					this.getUpcoming()
				}else if(this.tabCut==1){
					this.getFinished()
				}
				
			},
			upcomingOpen(i){
				this.uocomingList[i].show = !this.uocomingList[i].show
			},
			finishedOpen(i){
				this.finishedList[i].show = !this.finishedList[i].show
			},
			getToday(){
				//今天的课程
				var classStr = 'page=1&type=1&pagesize=48'
				var _this = this
				classList(classStr).then((res) => {
					_this.roomList = res.list
					_this.nowTime = res.now_time
					_this.todayLeng = res.list.length 
				})
			},
			getUpcoming(){
				var _this = this
				var classStr = 'page=' + _this.upcomingPage + '&type=2&pagesize=1000'
				
					
				classList(classStr).then((res) => {
						
						_this.tabNav[0].num = res.count
						_this.nowTime = res.now_time
						if(res.list[0]){
							var listsLenght = 0
							var newList = []
							for(var i = 0; i < res.list.length; i++){
								//取总数量
								var lng = res.list[i].lists.length
								listsLenght = lng + listsLenght
								var date = res.list[i].date.split('-')
								var monthNum = date[1]*1
								var engMonth = ''
								if(monthNum == 1){
									engMonth = 'Jan'
								}else if(monthNum == 2){
									engMonth = 'Feb'
								}else if(monthNum == 3){
									engMonth = 'Mar'
								}else if(monthNum == 4){
									engMonth = 'Apr'
								}else if(monthNum == 5){
									engMonth = 'May'
								}else if(monthNum == 6){
									engMonth = 'Jun'
								}else if(monthNum == 7){
									engMonth = 'Jul'
								}else if(monthNum == 8){
									engMonth = 'Aug'
								}else if(monthNum == 9){
									engMonth = 'Sept'
								}else if(monthNum == 10){
									engMonth = 'Oct'
								}else if(monthNum == 11){
									engMonth = 'Nov'
								}else if(monthNum == 12){
									engMonth = 'Dec'
								}
								
								var userNameList = ''
								var itemData = res.list[i].lists
								for(var j = 0; j < itemData.length; j++){
									userNameList = userNameList + '<text class="panelHeaderMainTextItem">' + itemData[j].username + '</text>'
								}
								var day = res.list[i].date.replace(/-/g,"/")
								var newDay = new Date(day).getDay();
								var dayCycleArray=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
								var chatLeng = res.list[i].lists.length
								for(var k=0;k<7;k++){
									if(newDay==k){
										newDay=dayCycleArray[k];
									}
								}
								newList.push({month:engMonth,userName:userNameList,lists:itemData,week:newDay,day:date[2]*1,chatLeng:chatLeng,show:false})
							}
							
							_this.uocomingList =newList
							 
							
					}
					
				})
				
			},
			
			getFinished(){	
				var _this = this
				// var classStr = 'page=' + _this.finishedPage + '&type=3&pagesize=1000'
				var classStr = 'page=1&type=3&pagesize=1000'
				classList(classStr).then((res) => {
						_this.tabNav[1].num = res.count
						if(res.list[0]){
							var listsLenght = 0
							var newList = []
							for(var i = 0; i < res.list.length; i++){
								//取总数量 
								var lng = res.list[i].lists.length
								listsLenght = lng + listsLenght
								var date = res.list[i].date.split('-')
								var monthNum = date[1]*1
								var engMonth = ''
								if(monthNum == 1){
									engMonth = 'Jan'
								}else if(monthNum == 2){
									engMonth = 'Feb'
								}else if(monthNum == 3){
									engMonth = 'Mar'
								}else if(monthNum == 4){
									engMonth = 'Apr'
								}else if(monthNum == 5){
									engMonth = 'May'
								}else if(monthNum == 6){
									engMonth = 'Jun'
								}else if(monthNum == 7){
									engMonth = 'Jul'
								}else if(monthNum == 8){
									engMonth = 'Aug'
								}else if(monthNum == 9){
									engMonth = 'Sept'
								}else if(monthNum == 10){
									engMonth = 'Oct'
								}else if(monthNum == 11){
									engMonth = 'Nov'
								}else if(monthNum == 12){
									engMonth = 'Dec'
								}
								
								var userNameList = ''
								var itemData = res.list[i].lists
								for(var j = 0; j < itemData.length; j++){
									userNameList = userNameList + '<text class="panelHeaderMainTextItem">' + itemData[j].username + '</text>'
								}
								var day = res.list[i].date.replace(/-/g,"/")
								var newDay = new Date(day).getDay();
								var dayCycleArray=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
								var chatLeng = res.list[i].lists.length
								for(var k=0;k<7;k++){
									if(newDay==k){
										newDay=dayCycleArray[k];
									}
								}
								newList.push({month:engMonth,userName:userNameList,lists:itemData,week:newDay,day:date[2]*1,chatLeng:chatLeng,show:false})
							}
							
							// _this.uocomingList = _this.uocomingList.concat(newList)
							_this.finishedList = newList
							
							
						//格式话list
					}
					
				})
				
				
				
			}
		}
	}
</script>


<style>
	.left,
	.right {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		height: 100%;
		justify-content: center;
		align-items: center;
	}

	.listRoom {
		padding: 30rpx;
	}

	.titleText {
		font-size: 32rpx;
		font-weight: bold;
		color: #4e3c38;
	}

	.titleText b {
		display: inline-block;
		padding: 0 10rpx;
	}

	.titleText span {
		font-weight: normal;
		font-size: 24rpx;
	}

</style>
