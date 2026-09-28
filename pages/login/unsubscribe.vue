<template>
	<view class="page">
		<hx-navbar  ref="hxnb" :config="config" />
		<view v-html="content" class="policyText"></view>
	</view>
</template> 
<style>
	
	.policyText{
		font-size: 32rpx;
		color: #4e3d37;
		line-height: 52rpx;
		padding: 20rpx 40rpx 40rpx 40rpx;
	}
	.policyText p{
		padding: 10rpx 0 20rpx 0;
		margin: 0;
		word-wrap:break-word; 
	}
	.policyText p:nth-child(1){
		padding-top: 0;
	}
	p.listStyle{
		position: relative;
		padding-left: 36rpx; 
		padding-bottom: 0;
	}
	.listStyle::after{
		width: 10rpx;
		height: 10rpx;
		border-radius: 100%;
		display: block;
		position: absolute;
		background: #4e3d37;
		content: '';
		left: 4rpx;
		top: 30rpx;
	}
</style>
<script>	
	import { config } from '../../config.js'
	import { cancelArticle } from '../../models/index.js'
	export default {
		data() {
			return {
				url:'',
				config: {
					// 设置中间插槽标题将失效
					title: 'CANCELLATION INSTRUCTIONS',				
					rightButton: false,
					backgroundColor: [1, '#fafafa']
				}, 
				content:''
			}
		},
		components: {
		},
		onShow: function() {			
			var _this = this
			
			 
			cancelArticle().then((r) => {
				//console.log(r,'-----res')
				uni.getSystemInfo({
					success:(res) => {
						this.content = r
					},
				})
				
			}).catch(err => {
				//console.log(err,222222)
			})
		},
		onLoad() {
		
			
		},
		onReady() {
		},	
		methods: {
			
		}
	}
</script>



