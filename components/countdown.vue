<template>
	<view class="countdownBox">
		{{newTime}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newTime:'00:00',
				dateNum:''
			}
		},
		props: {
		   st: '',
		   et:''
		},
		created() {
			
			var _this = this
			
			var date = _this.et - _this.st; //得出的为秒数；
			var time = setInterval(function(){
				// var timedate = new Date("2021/5/28,14:32:55"); //自定义结束时间
				// var now = new Date(); //获取当前时间
				// var date = parseInt(timedate.getTime() - now.getTime()) / 1000; //得出的为秒数；
				date--	
				_this.dateNum = date			
				if (date <= 0) {
					//倒计时结束
					clearInterval(time);	
					_this.newTime = "00:00"
					return
				}
				var day = parseInt(date / 60 / 60 / 24);
				var hour = parseInt(date / 60 / 60 % 24);
				var minute = parseInt(date / 60 % 60);
				var second = parseInt(date % 60);
				
				if(day>0){
					day = day+'d:'
				}else{
					day = ''
				}
				
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
				_this.newTime =day + hour + ":" + minute +":"+ second;
			}, 1000);
			
		},		
		methods: {
			goRoom(id){
				uni.navigateTo({
				    url: '/pages/room/index?roomId='+id+'&userType='+this.userInfo.user_type,
				    animationType: 'pop-in',
				    animationDuration: 200
				});
			}
		}
	}
</script>

<style>
.countdownBox{
	font-size: 26rpx;
	color: #4e3d37;
}
</style>