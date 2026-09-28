import { config } from '../config.js'
import util from "@/util/util"
import store from "@/store/store"

export const apiResquest = (prams) => { //prams 为我们需要调用的接口API的参数 下面会贴具体代码

	// 判断请求类型
	let headerData = {
		'content-type': 'application/x-www-form-urlencoded',
		'authentication': uni.getStorageSync('userInfo').token
		//'content-type': 'application/json'
	}
	
	 
	let dataObj = null
        //因为我们的GET和POST请求结构不同这里我们做处理，大家根据自己后台接口所需结构灵活做调整吧
	if (prams.method === "GET") {
		headerData = {
			'content-type': 'application/x-www-form-urlencoded',
			'authentication': uni.getStorageSync('userInfo').token
		}
	} else {
		headerData = {
			'content-type': 'application/x-www-form-urlencoded',
			'authentication': uni.getStorageSync('userInfo').token
		}
		dataObj = prams.query
		// dataObj = {
		// 	'data': prams.query,
		// 	'token': uni.getStorageSync('token')
		// }
	}
	
	console.log(headerData,'headerData-----------')
	
	return new Promise((resolve, reject) => {
		let url = config.base_url + prams.url; //请求的网络地址和局地的api地址组合
		uni.showLoading({
			title: 'Loading',
			mask: true
		})
		return uni.request({
			url: url,
			data: dataObj,
			method: prams.method,
			header: headerData,
			sslVerify: false,
			success: (res) => {
				setTimeout(() => {
					uni.hideLoading()
				}, 400)
                                //这里是成功的返回码，大家根据自己的实际情况调整
				 
				//console.log(res,'原始---------------原始')
				if(res.data.code == 401){ 
					uni.removeStorage({
					    key: 'userInfo',
					    success: function (res) {
							console.log(res)
							store.commit("login", '')
							uni.showToast({
								icon:'none',
							    title: 'Please log in!'
							});
							
							setTimeout(function () {							 
								util.isLogin()
							}, 1000);
					    }
					});
					return;
				}
				if (res.data.code !== 200) { 
					uni.showToast({
						title: res.data.msg,
						duration: 1000,
						icon: "none"
					})
					return;
				}
				
				 
				resolve(res.data.data);
			},
			fail: (err) => {
				reject(err);
				console.log(err)
				
				setTimeout(() => {					uni.hideLoading()				}, 400)
			},
			complete: () => {
				//console.log('请求完成')
				setTimeout(() => {
					uni.hideLoading()
				}, 400)
			}
		});
	})
}