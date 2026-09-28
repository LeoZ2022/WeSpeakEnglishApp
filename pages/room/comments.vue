<template>
	<view class="page">
		<hx-navbar ref="hxnb" :config="config" ></hx-navbar>
		<view class="commentsPage">
			<view class="commentsChanges">
				<uniRate v-model="value" allowHalf touchable margin="10" :size="30" />
			</view>
			<view class="commentsTextarea">
				<textarea placeholder-style="color:rgba(78,61,55,.5)"  v-model="comment" confirm-type="done" placeholder="How is your partner's performance?"/>
			</view>
			<view class="commentsFoot">
				<button class="commentsBtn" @click="submit()">
					<text class="commentsBtnText">Submit</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { commentClass } from '../../models/index.js'
	import uniRate from "../../components/uniRate.vue"
	export default {
		components:{
			uniRate
		},
		data() {
			return {
				config: {
					// 设置中间插槽标题将失效
					title: 'Rate your partner',
					backgroundColor: [1, '#eaecf8']
				},
				value: 5,
				classId:'',
				comment:''
			}
		},
		onBackPress(e) {
			uni.switchTab({
				url: '/pages/index/index'
			});
			return true;
		},
		onShow() {
			plus.navigator.setFullscreen(false);
		},
		onLoad(op) {
			this.classId = op.classId 
		},
		methods: {
			submit() {
				var _this = this
				var commentData = {comment:_this.comment,class_id:_this.classId,score:_this.value}
				console.log(commentData,'commentData')
				if(_this.comment==''){
					uni.showToast({
						title: 'Content cannot be empty!',
						duration: 1000,
						icon: "none"
					})
					return;
				}else{
					commentClass(commentData).then((res) => {
						uni.showModal({
							title: 'Success!',
							content: 'Post comment successfully.',
							showCancel:false,
							confirmText: 'Continue',
							success: function(res) {
								if (res.confirm) {
									setTimeout(function() {
										uni.switchTab({
											url: '/pages/index/index'
										})
									}, 1000);
						
								}
							}
						});
					})
				}
			}
		}
	}
</script>

<style>
	.commentsChanges{
		padding: 50rpx 0 0 0;
		text-align: center;
		display: flex;
		justify-content: center;
	}
	.commentsPage{
		padding: 0 50rpx;
	}
	.commentsTextarea{
		margin: 30rpx 0 0 0;
		padding: 15rpx;
		background-color: #fff;
		border: 1px solid #eeeceb;
		border-radius: 10rpx;
	}
	.commentsBtn{
		border: none !important;
		background:none !important;
		padding: 0 !important;
	}
	.commentsBtnText{
		background-color: #5d73bc;
		color: #f8f8f8;
		font-size: 32rpx;
		line-height: 100rpx;
		width: 100%;
		display: block;
	}
	.commentsFoot{
		padding: 30rpx 0 0 0;
	}
</style>

