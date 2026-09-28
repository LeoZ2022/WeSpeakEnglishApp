<template>
	<view class="page" style="display: flex; flex: 1; justify-content: center; padding: 150rpx 0 0 0;">
		<image src="../../static/noStart.png" class="noStart"></image>
	</view>
</template>

<script>
	export default { 
		data() {
			return {
				
			}
		},
		 
		onShow() {
			plus.navigator.setFullscreen(false);
		},
		onLoad(op) { 
			var _this = this
			let pages = getCurrentPages(); // 当前页面
			let beforePage = pages[pages.length - 2]; // 前一个页面
			uni.showModal({
				title: 'En Chat',
				content: 'You can enter the chatroom up to 5 minutes before the chat start time.',
				showCancel:false,
				confirmText: 'Back',
				success: function(res) {
					if (res.confirm) {
						uni.switchTab({
							url: '/pages/index/index',
							success: function() {
							    beforePage.onLoad(); // 执行前一个页面的onLoad方法
							}
						})
					}
				}
			});
		},
		methods: {
			
		}
	}
</script>

<style>
	.noStart{
		width: 590rpx;
		height: 400rpx;
		margin: 0 auto;
	}
</style>

