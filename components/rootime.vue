<template>
	<view class="closeCountDown"> 
		<text class="closeCountDownIcon" :class="{'countDowns1':classState=='Upcoming','countDowns2':classState=='Timer','countDowns3':classState=='Close in'}"></text>
		<text class="closeCountDownText">{{classState}}</text>
		<text class="closeCountDownTime" :class="{'closeCountDownTextEnd' : classState=='Close in'}">{{countdownTime}}</text>
	</view>
</template>

<script>
	const io = require('@/static/weapp.socket.io.js')
	const socket = io('http://app.wespeakenglish.chat:2120')
	import { classBegin } from '@/models/index.js'
	
	export default {
		props: {
		   roomId:''
		},
		data() {
			return {
				classState:'',
				toStartTime:'',
				timelen:',',
				haveClassTime:'00:00:00',
				countdownTime:'00:00:00',
				myClassInfo:'',
				overTime:'',
				startTime:'',
				userAll:false,
				autoStartTime:0,
				beginTime:'',
				socketNewTime:0,
				isOverStart:false
			}
		},
		watch: {
			isFollow (newVal, oldVal) {
				console.log(newVal,'newVal')
				console.log(oldVal,'oldVal')
				this.socketMsg(newVal)
			    //do something
			}
		},
		computed: {
			isFollow () {
				return this.$store.state.socketMsg;　　//需要监听的数据
			}
		},
		mounted() {
			this.$nextTick(() => {
				
		    });
		},		
		methods: {
			getClassInfo(data){
				
				
				var _this = this
				console.log(data,'课程信息rootime----》》》》》')
				this.userInfo = this.$store.state.userInfo
				
				this.myClassInfo = data 
				
				this.timelen       = this.myClassInfo.timelen*60
				this.toStartTime   = this.myClassInfo.datetime - this.myClassInfo.now_time
				this.autoStartTime = this.myClassInfo.datetime - this.myClassInfo.now_time
				
				
				this.haveClassTime = this.myClassInfo.timelen*60 - this.myClassInfo.class_time_len
				 
				
				//第二次访问
				
				// console.log(this.myClassInfo.timelen*60*1000,'timelen')
				// console.log(this.myClassInfo.now_time,'.now_time')
				// console.log(this.beginTime,'beginTime')
				// console.log(this.myClassInfo.class_time_len,'class_time_len')
				// console.log(this.haveClassTime,'haveClassTime')
				
				 
				if(this.toStartTime>0){
					this.classState = 'Upcoming'
					//console.log('Upcoming-----')
				}else{
					if(this.haveClassTime>60){ 
						this.classState = 'Timer'
						//console.log('Timer-----')
					}else if(this.haveClassTime<60){
						//console.log('Close in-----')
						this.classState = 'Close in'
						console.log(this.haveClassTime,'this.haveClassTime---end')
						if(this.haveClassTime < 0) {
							// 1. Kill the video service immediately BEFORE showing the modal
							this.$parent.outRoom('quick'); 

							uni.showModal({
								title: 'En Chat',
								content: 'The chat is over.',
								showCancel: false,
								confirmText: 'Back',
								success: function(res) {
									_this.beginTime = '';
									if (res.confirm) {
										// 2. Only handle navigation here
										setTimeout(function() {
											 uni.navigateBack();
										}, 100);
										_this.isClassStart = false;
									}
								}
							});
						}	
					} 
				} 
				
				if (this.userInfo.user_type == 1) {
					if(this.myClassInfo.last_in_time_teacher  > this.myClassInfo.out_time_teacher){
						this.userAll = true
						console.log(this.userAll,'判断是否进来11111----')
					}else{
						this.userAll = false
						console.log(this.userAll,'判断是否进来22222222----')
					}
				}else{
					if(this.myClassInfo.last_in_time_student  > this.myClassInfo.out_time_student){
						this.userAll = true
						console.log(this.userAll,'判断是否进来3333333----')
					}else{
						this.userAll = false
						console.log(this.userAll,'判断是否进来4444444----')
					}
				}
				//console.log(this.userAll,'this.userAll11111-------')
				
				if(this.toStartTime>0){
					this.startClass()
				}else{
					if(this.userAll){
						this.overClass()
					}
					
					//
					var dfHour = parseInt(this.haveClassTime / 60 / 60 % 24);
					var dfMinute = parseInt(this.haveClassTime / 60 % 60);
					var dfSecond = parseInt(this.haveClassTime % 60);
					if(dfHour<10){
						dfHour = '0'+dfHour
					}
					if(dfMinute<10){
						dfMinute = '0'+dfMinute
					}
					if(dfSecond<10){
						dfSecond = '0'+dfSecond
					}	
					this.countdownTime = dfHour + ":" + dfMinute +":"+ dfSecond;
						
				}
			},
			postClassBegin(){
				var classId = 'classin_id=' + this.myClassInfo.classin_id
				classBegin(classId).then((res) => {
					//console.log(res+'/'+this.myClassInfo.classin_id,'-----------aaaa')
				})
			},
			socketMsg(msg){
				var _this = this
				console.log(msg,'rootime=====')
				var msgData = msg.split("##")
				var msgJson = {
					act: msgData[0], 
					msg: msgData[1], 
					class_id: msgData[2], 
					classin_id: msgData[3], 
					class_time: msgData[4],
					current_time: msgData[5]
				}
				console.log(msgJson,'socket') 
				
				// 判断是否为当前房间的通知
				
				if(msgJson.act == 9){
					_this.$parent.newNoticeOpen(msgJson.msg)
				}
				
				if(this.myClassInfo.id == msgJson.class_id){
					_this.$parent.newNoticeOpen(msgJson.msg)
					
					if(msgJson.act == 1){
							_this.$parent.tipsMusic()
							console.log(msgJson,'人来齐了，开始上课！')
							_this.userAll = true
							_this.$parent.chatRoomTipsShow = false
							_this.$parent.chatTipsTextShow = false
							if(_this.isOverStart){
								_this.socketNewTime = msgJson.current_time
							}
							//console.log('555555----')
							if(_this.autoStartTime<=0){
								//console.log(_this.haveClassTime,'6666----')
								_this.haveClassTime = _this.timelen - msgJson.class_time
								//console.log(_this.haveClassTime,'77777----')
								_this.classState = 'Timer'
								clearInterval(_this.startTime)
								_this.overClass() 
								_this.$parent.isClassStart = true
							}
							
					}else if(msgJson.act == 2){
						_this.$parent.tipsMusic()
						_this.userAll = false
						console.log('有人退出了！/'+_this.autoStartTime)
						_this.socketNewTime = 0
						if(_this.classState == 'Timer' || _this.classState == 'Close in'){
							_this.$parent.chatRoomTipsShow = true
							_this.$parent.chatRoomTipsText = 'Your partner has left the room, please wait 5 minutes. If he/she does not come back, the chatroom will be closed.'
						}
						clearInterval(_this.overTime)
					}else if(msgJson.act == 7){
						_this.$parent.tipsMusic()
						_this.userAll = false
						console.log('有人退出了！/'+_this.autoStartTime)
						_this.socketNewTime = 0 
						
						if(_this.classState == 'Timer' || _this.classState == 'Close in'){
							_this.$parent.chatRoomTipsShow = true
							_this.$parent.chatRoomTipsText = 'Your partner has left the room, please wait 5 minutes. If he/she does not come back, the chatroom will be closed.'
						}
						clearInterval(_this.overTime)
					}else if(msgJson.act == 8){
						_this.userAll = false
						console.log('你的伙伴还没进来！/'+_this.autoStartTime) 
						clearInterval(_this.overTime)
					}else if(msgJson.act == 3){
						_this.$parent.tipsMusic()
						console.log(msgJson,'人都回来了，继续上课！') 
						_this.$parent.chatTipsTextShow = false
						_this.userAll = true
						if(_this.isOverStart){
							_this.socketNewTime = msgJson.current_time
						}
						_this.haveClassTime = _this.timelen - msgJson.class_time 
						_this.classState = 'Timer' 
						_this.$parent.chatRoomTipsShow = false
						clearInterval(_this.overTime)
						_this.overClass()
						_this.$parent.isClassStart = true
					}else if(msgJson.act == 4){
						console.log('对方超时，课程结束')
						_this.$parent.chatTipsTextShow = false
						_this.socketNewTime = 0
						clearInterval(_this.overTime)
						_this.$parent.outRoom('ok','Operation timeout. The chat is over.')
						_this.countdownTime = "00:00"
					}else if(msgJson.act == 5){
						_this.$parent.chatTipsTextShow = false
						console.log('课程顺利完成')
						clearInterval(_this.overTime)
						_this.socketNewTime = 0
						_this.$parent.outRoom('ok')
						_this.countdownTime = "00:00"
					}else if(msgJson.act == 6){
						console.log('迟对方到未进入')
						clearInterval(_this.overTime)
						_this.socketNewTime = 0
						_this.$parent.outRoom('ok','Your partner seems unlikely to show up. The chat is now over.')
						_this.countdownTime = "00:00"
					} 
				}
			},
			startClass(){
				clearInterval(this.startTime); 
				var _this = this
				var date = _this.toStartTime
				
				//console.log(date,'toStartTime------')
				_this.startTime = setInterval(function(){
					//console.log(date,'toStartTime============')
					date--
					_this.autoStartTime = date
					//console.log(date,'toStartTime------')
					if(date < 1){
							
							clearInterval(_this.startTime);	
							_this.countdownTime = "00:00"
							_this.$parent.chatRoomTipsShow = true
							
							if(_this.myClassInfo.class_time_len > 600){
								_this.$parent.chatRoomTipsText = 'Your partner has left the room, please wait 5 minutes. If he/she does not come back, the chatroom will be closed.'
																  
							}
							
							
							console.log(_this.userAll,'userAll')
						if(_this.userAll){
							console.log('全部到了开始计时--------')
							_this.$parent.chatRoomTipsShow = false
							_this.overClass()
							_this.$parent.isClassStart = true
						}
						return
					}
					 
					var hour = parseInt(date / 60 / 60 % 24);
					var minute = parseInt(date / 60 % 60);
					var second = parseInt(date % 60);
					if(hour<10){
						hour = '0'+hour
					}
					if(minute<10){
						minute = '0'+minute
					}
					if(second<10){
						second = '0'+second
					}	
					
					_this.countdownTime = hour + ":" + minute +":"+ second;
				}, 1000);
			},
			overClass(){
				clearInterval(this.overTime);
				this.isOverStart = true
				 
				
				if(this.userInfo.user_type == 2){
					this.postClassBegin()
				}
				
				//this.myClassInfo.timelen*60 - this.myClassInfo.class_time_len
				// if(this.myClassInfo.class_time_begin == 0){
				// 	this.$parent.getClassInfo()
				// }else{
					if(this.haveClassTime>60){
						this.classState = 'Timer'
					}else{
						this.classState = 'Close in'
					}
					
					
					var _this = this
					var date = _this.haveClassTime
					console.log(date,'haveClassTime+++++++')
					_this.overTime = setInterval(function(){
						//console.log(date,'haveClassTime======')
						date--
						
						//console.log(date,'haveClassTime-------')
						if(date <= 0){
							console.log('课程结束了1111。。。。。。')
							//_this.outRoom('ok')
							
							//倒计时结束
							clearInterval(_this.overTime);	
							_this.countdownTime = "00:00"
							_this.haveClassTime = date
							_this.$parent.outRoom('ok')
							console.log('课程结束了2222。。。。。。')
							return
						}else if(date<60){
							_this.classState = 'Close in'
							console.log('Close in 60')
						}
						 
						var hour = parseInt(date / 60 / 60 % 24);
						var minute = parseInt(date / 60 % 60);
						var second = parseInt(date % 60);
						if(hour<10){
							hour = '0'+hour
						}
						if(minute<10){
							minute = '0'+minute
						}
						if(second<10){
							second = '0'+second
						}					
						_this.countdownTime = hour + ":" + minute +":"+ second;
					}, 1000);
			}
		}
	}
</script>

<style>

	.closeCountDown{
		padding: 0 15rpx;
		line-height: 40rpx; 
		background-color: rgba(255,255,255,.8);
		border-radius: 20rpx;
		height: 40rpx;
		flex-direction: row;
		display: flex;
		justify-content:center;
		align-items: center;
	}
	.closeCountDownText{
		font-size: 26rpx;
		color: #333;
		flex: 1 1 0%;
		line-height: 40rpx; 
	}
	
	.closeCountDownTime{
		color: red;
		font-size: 26rpx;
		margin-left: 10rpx;
		flex: 1 1 0%;
		line-height: 40rpx; 
		color: #333;
	}
	.closeCountDownTextEnd{
		color: #f53b47;
	}
	.closeCountDownIcon{
		width: 14rpx;
		height: 14rpx;
		border-radius: 10rpx;
		margin-right: 10rpx;
		background-color: #333;
	}
	.countDowns1{
		background-color: #333;
	}
	.countDowns2{
		background-color: #37e360;
	}
	.countDowns3{
		background-color: #f53b47;
	}
</style>