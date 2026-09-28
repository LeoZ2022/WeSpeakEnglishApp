<template>
	<view @click="goRoom(classData)" :class="{'wait':dateNum<300 && classData.order_status==1 , 'ongoing': dateNum < 1 && classData.order_status==1 , 'searchList':type=='search'}" class="roomBox">
	<!-- <view @click="goRoom(classData)" :class="{'wait':dateNum<300 || (classData.datetime-nowTime)<300, 'ongoing': dateNum < 1 || (classData.datetime-nowTime)<1}" class="roomBox"> -->
		<view class="roomBoxRight">
			<view class="roomBoxState">
				<block v-if="dateNum<1">Ongoing</block>
				<block v-else>Upcoming</block>
			</view>
			<view class="roomBoxCountdown">
				{{newTime}}
			</view>
			<view class="roomBoxEnter">
				Enter
			</view>
		</view>
		<view class="roomBoxLeft">
			<view class="roomBoxLeftMonth"><text class="roomBoxLeftMonthText">{{classData.day}}</text><text class="roomBoxLeftMonthText">{{classData.month}}</text></view>
			<view class="roomBoxLeftWeek">{{classData.week}}</view>
			<block v-if="userInfo.user_type == 1">
				<b>{{util.dateTonum(classData.time_begin)}}</b>
				{{util.timeFrame(classData.time_begin)}}
			</block>
			<block v-else>
				<b>{{util.dateTonum(classData.time_begin_teacher)}}</b>
				{{util.timeFrame(classData.time_begin_teacher)}}
			</block>
		</view>
		
		<view class="roomBoxMain">
			<view class="roomBoxName">{{classData.username}}</view>
			<view class="roomBoxTime">
				<block v-if="userInfo.user_type == 1">
					{{util.dateTonum(classData.time_begin)}} - {{util.dateTonum(classData.time_end)}}
				</block>
				<block v-else>
					{{util.dateTonum(classData.time_begin_teacher)}} - {{util.dateTonum(classData.time_end_teacher)}}
				</block>
			</view>
			<view class="roomBoxId">Room ID：<span>{{classData.classin_id}}</span></view>
		</view>
	</view>
</template>

<script>
	import permitApp from '@/common/permitApp.js'
	export default {
		data() {
			return {
				newTime:'00:00',
				userInfo:'',
				dateNum:'',
				classData:'',
				time:'',
				startClassTime:''
			}
		},
		props: {
		   classInfo: '',
		   nowTime:'',
		   type:''
		},
		watch: {
			classInfo(val) {
				this.classData = val
				clearInterval(this.time);
				clearInterval(this.startClassTime);
				this.listTime()
				
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.userInfo = this.$store.state.userInfo
				this.classData = this.classInfo
				clearInterval(this.time);
				clearInterval(this.startClassTime);
				this.listTime() 
				
			})
			
			
		},		
		methods: {
			async goRoom(data){
				var timedate = data.datetime //自定义结束时间
				var now = this.nowTime; //获取当前时间
				var date = timedate - now; //得出的为秒数；
				
				if(this.classData.order_status==1){
					if(date>300){
						
						
						
						uni.navigateTo({
							url: '/pages/room/noStart?roomId='+data.id+'&userType='+this.userInfo.user_type,
							animationType: 'pop-in',
							animationDuration: 200
						});
						
					}else{
						
						var isAndroid = false ;
						if (uni.getSystemInfoSync().platform == 'android') {
							isAndroid = true ;//是不是安卓系统标记\
							var iscan = await permitApp.req_Permit_any(isAndroid, permitApp.p_ID_anrd.camera, permitApp.p_ID_ios.camera,'camera')
							var isrecord = await permitApp.req_Permit_any(isAndroid, permitApp.p_ID_anrd.record, permitApp.p_ID_ios.record,'microphone')
							 
							if (iscan && isrecord) {
								clearInterval(this.$parent.startTime);
								uni.navigateTo({
									url: '/pages/room/index?roomId='+data.id+'&userType='+this.userInfo.user_type,
									animationType: 'pop-in',
									animationDuration: 200
								});
								
							}
							
							
						}else{
							
							uni.navigateTo({
								url: '/pages/room/index?roomId='+data.id+'&userType='+this.userInfo.user_type,
								animationType: 'pop-in',
								animationDuration: 200
							});
						}
						
					}
				}else{
					uni.showModal({
						title: 'En Chat',
						content: 'The chat is over！',
						showCancel: false,
						confirmText: 'Confirm',
						success: function(res) {
							if (res.confirm) {
								
							}
						}
					});
				}
				
			},
			listTime(){
				var _this = this
				var timedate = _this.classData.datetime //自定义结束时间
				var now = _this.nowTime; //获取当前时间
				var date = timedate - now; //得出的为秒数；
				_this.time = setInterval(function(){
					// var timedate = new Date("2021/5/28,14:32:55"); //自定义结束时间
					// var now = new Date(); //获取当前时间
					// var date = parseInt(timedate.getTime() - now.getTime()) / 1000; //得出的为秒数；
					date--	
					_this.dateNum = date			
					if (date <= 0) {
						//倒计时结束
						clearInterval(_this.time);
						clearInterval(_this.startClassTime);
						_this.newTime = "00:00"
						_this.startTime(date)
						return
					}
					var day = parseInt(date / 60 / 60 / 24);
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
					//_this.newTime = day + "天" + hour + "：" + minute + "分" + second + "秒";
					_this.newTime = hour + ":" + minute +":"+ second;
				}, 1000);
			},
			startTime(d){
				var _this = this
				var date = Math.abs(d) //得出的为秒数；
				
				_this.startClassTime = setInterval(function(){
					// var timedate = new Date("2021/5/28,14:32:55"); //自定义结束时间
					// var now = new Date(); //获取当前时间
					// var date = parseInt(timedate.getTime() - now.getTime()) / 1000; //得出的为秒数；
					date++	 		
					if (date <= 0) {
						//倒计时结束
						clearInterval(_this.startClassTime);	
						_this.newTime = "00:00"
						return
					}
					var day = parseInt(date / 60 / 60 / 24);
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
					//_this.newTime = day + "天" + hour + "：" + minute + "分" + second + "秒";
					_this.newTime = hour + ":" + minute +":"+ second;
				}, 1000);
			}
		}
	}
</script>

<style>
 
</style>