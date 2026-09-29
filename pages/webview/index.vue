<!--App 内嵌网页：打开网站的注册页 / 社交登录页，登录成功后网站会把登录态 postMessage 回来-->
<template>
	<web-view :src="url" @message="onMessage"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(option) {
			if (option.url) {
				this.url = decodeURIComponent(option.url);
			}
			if (option.title) {
				uni.setNavigationBarTitle({ title: decodeURIComponent(option.title) });
			}
		},
		methods: {
			//网站登录成功页会 postMessage 用户信息（含 App token），同时页面会自动 navigateBack 关闭自己
			//这里只负责保存登录态，不再二次返回，避免多退一页
			onMessage(e) {
				var msgs = (e.detail && e.detail.data) || [];
				for (var i = 0; i < msgs.length; i++) {
					var m = msgs[i];
					if (m && m.type === 'wespeak-social-login' && m.user && m.user.token) {
						var userInfo = m.user;
						var _this = this;
						uni.setStorage({
							key: 'userInfo',
							data: userInfo,
							success: function () {
								_this.$store.commit('login', userInfo);
								uni.showToast({ title: 'Signed in successfully', icon: 'none' });
							}
						});
					}
				}
			}
		}
	}
</script>

<style>
</style>
