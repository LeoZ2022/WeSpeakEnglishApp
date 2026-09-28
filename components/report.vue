<template>
	<view class="report" v-if="reportShow">
		<view class="reportBox">
			<view class="reportHead">
				<text class="reportTitle">REPORT</text>
				<text class="reportClose ly-icon" :class="{'btnTap' : btnTap}"
					@touchstart="closeTap" @touchend="closeTapEnd" @click="close">&#xe622;</text>
			</view>
			<view class="reportMain">
				<picker @change="reportChange" :value="index" :range="array">
					<view class="reportSelect">
						<text class="reportSelectIcon ly-icon">&#xe625;</text>
						<text class="reportSelectBox" v-if="index === '' " style="color: #999;">Please select a report type</text>
						<text class="reportSelectBox" v-else>{{array[index]}}</text>
					</view>
				</picker>
				<input class="reportInput" v-model="content" v-if="index==4" focus placeholder="Please enter" />
				<view class="reportFoot" >
					<view class="reportFootBtn" @click="submit">SUBMIT</view>
					<view class="reportFootBtn"  @click="close">CANCEL</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script> 

import { tousu } from '@/models/index.js'
const dom = weex.requireModule('dom');
	dom.addRule('fontFace', {
		fontFamily: 'lyicon',
		src: "url('/static/iconFont/iconfont.ttf')"
	});
	export default {
		data() {
			return {
				reportShow:false,
				btnTap:false,
				array: ['Porn', 'Advertisement', 'Violence', 'Harassment' ,'Other'],
				index:'',
				content:'',
				roomId:''
			}
		},
		 
		
		methods: {
			reportChange: function(e) {
				console.log('picker发送选择改变，携带值为', e)
				this.index = e.detail.value
			},
			closeTap(){
				this.btnTap = true
			},
			closeTapEnd(){
				this.btnTap=false;
			},
			close(){
				this.reportShow = false
			},
			submit(){
				var _this = this
				if(this.index===''){
					uni.showToast({
					    title: "Please select a report type!",
						icon:'none'
					});
					return
				}
				if(this.index==4 && this.content == ''){
					uni.showToast({
					    title: "Please fill in the report content!",
						icon:'none'
					});
					return
				}
				
				uni.showModal({
					title: 'Are you sure report your partner?',
					content: 'Please ensure the authenticity of the content you report. We will verify it. If it is true, we will block the account and submit it to relevant departments.',
					cancelText: 'No',
					confirmText: 'Yes',
					success: function(res) {
						if (res.confirm) {
							var body = ''
							if(_this.index == 4){
								body = _this.content
							}else{
								body = ''
							}
							
							var data = {title:_this.array[_this.index],body:body,roomId:_this.roomId}
							console.log(data,'datatousu----')
							tousu(data).then((res) => {
								console.log(res,'tousu----')
								uni.showModal({
									title: 'Submission successful!',
									content: 'We will review your feedback and reply to you. Thanks.',
									showCancel:false,
									confirmText: 'Close',
									success: function(r) {
										if (r.confirm) {
											_this.reportShow = false
										}
									}
								});
								
							}).catch(err => {
								//console.log(err,222222)
							})
							
							
						}
					}
				});
			}
		}
	}
</script>

<style>
	.ly-icon {
		font-family: lyicon;
	}
.report{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,.7);
	flex-direction: row;
	display: flex;
	justify-content:center; 
	align-items: center;
	z-index:9999;
}
.reportBox{
	background-color: #fff;
	border-radius: 20rpx; 
	width: 660rpx;
	border-radius: 20rpx;
	
}
.reportHead{
		position: relative;
		margin: 15rpx 0 0 0;
	}
	.reportClose{
		position: absolute;
		right: 0;
		top: 0; 
		width: 150rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 45rpx;
		font-weight: bold;
		color: #c5c1c0;
	}
	.reportTitle{
		color: #4e3d37;
		font-size: 40rpx;
		font-weight: bold;
		line-height: 100rpx;
		padding-left: 50rpx;
	}
	.btnTap{
		color: #333;
	}
	
	.reportMain{
		padding: 20rpx 50rpx;
	}
	.reportSelect{
		
		
		
	}
	.reportSelectBox{
		font-size: 28rpx;
		line-height: 84rpx;
		height: 84rpx;
		padding: 0 25rpx;
		position: relative;
		border: 1px solid #ccc;
		border-radius: 10rpx;
		font-size: 32rpx;
	}
	.reportSelectIcon{
		position: absolute;
		right: 25rpx;
		top: 14rpx; 
	}
	.reportFoot{
		padding: 50rpx 0 0 0;
		text-align: center;
		font-size: 0;
		flex: 1;
		flex-direction: row;
		display: flex;		 
		justify-content: flex-end;
	}
	.reportFootBtn{
		margin: 0 0 20rpx 0; 
		border-radius: 10rpx;
		line-height: 60rpx;
		color: #333;
		text-align: center;
		font-size: 32rpx; 
		padding: 0 0 0 70rpx;
	}
	.reportInput{
		border: 1px solid #ccc;
		border-radius: 10rpx;
		line-height: 84rpx;
		height: 84rpx;
		padding: 0 25rpx;
		font-size: 32rpx;
		margin-top: 30rpx;
	}
</style>
