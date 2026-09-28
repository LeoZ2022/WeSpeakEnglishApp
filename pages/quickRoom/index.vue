<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config">
			<block slot="right">
				<view class="right">
					<view class="headRight">
						<scan />
					</view>
				</view>
			</block>
		</hx-navbar>
		<view class="pageMain">
			<view class="textBox">You can enter the chat room by either scanning the chat room QR code on the website or entering the chat room ID directly.</view>
			<view class="borderInput">
				<input class="borderInputText" v-model="value" @confirm="search()" @keyup.enter="search()" confirm-type="search" placeholder="Enter Chat room ID" />
				<text class="iconfont iconsearch" @click="search()"></text>
			</view>
			<view class="quickSearchTitle" v-if="isSearch">Find<b v-if="todayLeng">{{todayLeng}}</b><b v-else>0</b>chat room(s)</view>
			
			<view v-if="todayLengNo" style="color:rgba(78,61,55,.5); font-size: 32rpx; padding:20rpx 0;">No room found, please check the room ID.</view>
			<view class="roomList" v-else>
				<view v-for="(item,index) in roomList" :key="index" class="roomPad">
					<roomlist :classInfo="item" :nowTime="nowTime" type="search"></roomlist>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { classList } from '../../models/index.js'
	import scan from "../../components/scan.vue"
	import roomlist from "../../components/roomlist.vue"
	export default {
		data() {
			return {
				value:'',
				nowTime:'',
				todayLeng:'--',
				config: {
					// 设置中间插槽标题将失效
					title: 'Quick Chat Room',
					
					rightSlot: true,
					rightSlotSwitch: true,
					// 使用插槽还是能添加btn按钮
					rightButton: false,
					back:false,
					backgroundColor: [1, '#eaecf8']
				},
				roomList: [],
				todayLengNo:false,
				userInfo:'',
				isSearch:false
			}
		},
		components: {
			scan,
			roomlist
		},
		onShow: function() {
			this.util.isLogin()
			plus.navigator.setFullscreen(false);
			this.userInfo = this.$store.state.userInfo
		},
		onLoad: function (option) { 
			if(option.key){ 
				this.value = option.key
				this.search()
			}	 
		},
		methods: {
			search(){ 
				//今天的课程
				var classStr = 'page=1&type=1&sn='+ this.value
				var _this = this
				
				_this.isSearch = true
				classList(classStr).then((res) => {
					var roomList = res.list
					console.log(res.list,'res.list-----')
					if(res.list[0]){
						for(var i = 0; i < roomList.length; i++){
							var date,dateJson
							if(_this.userInfo.user_type==1){
								date = roomList[i].book_date.split('-')
								dateJson = roomList[i].book_date
							}else{
								date = roomList[i].book_date_teacher.split('-')
								dateJson = roomList[i].book_date_teacher
							}
							
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
							 
							var day = dateJson.replace(/-/g,"/")
							var newDay = new Date(day).getDay();
							var dayCycleArray=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];
							for(var k=0;k<7;k++){
								if(newDay==k){
									newDay=dayCycleArray[k];
								}
							}
							roomList[i].day = date[2]
							roomList[i].week = newDay
							roomList[i].month = engMonth
							console.log(date[2],'日')
							console.log(newDay,'day')
							console.log(engMonth,'engMonth')
							console.log(newDay,'newDay')
							
						}
					}
					
					_this.nowTime = res.now_time
					_this.todayLeng = res.list.length
					if(_this.todayLeng == 0){
						_this.todayLengNo = true
					}else{
						_this.todayLengNo = false
					}
					_this.roomList = roomList
					console.log(_this.roomList,'_this.roomList----------------')
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
	input[type=search] { 
	    -webkit-appearance: none; 
	}
</style>
