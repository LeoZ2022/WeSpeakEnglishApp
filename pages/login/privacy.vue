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
	import { getArticle } from '../../models/index.js'
	export default {
		data() {
			return {
				url:'',
				config: {
					// 设置中间插槽标题将失效
					title: '',				
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
			
			uni.getSystemInfo({
				success:(res) => {
					
				//	if(res.platform=="android"){
				//		_this.config.title = '隐私政策'
				//	}else{
				//		_this.config.title = 'PRIVACY POLICY'
				//	}
					 _this.config.title = 'PRIVACY POLICY'
				},
			})
			getArticle(2).then((r) => {
				//console.log(r,'-----res')
				uni.getSystemInfo({
					success:(res) => {
						console.log(r,'原始---------------原始')
						//检测当前平台，如果是安卓则启动安卓更新  
					//	if(res.platform=="android"){
					//		_this.content = r.cn
					//	}else{
					//		_this.content = r.en
					//	}
						 _this.content = r.en
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



