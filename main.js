import Vue from 'vue'
import App from './App'
import store from "@/store/store"
import util from "@/util/util.js" 

import io from '@/static/weapp.socket.io.js'
// 全局注册socket
Vue.prototype.$io = (io('http://app.wespeakenglish.chat:2120'))
import hxNavbar from "@/uni_modules/hx-navbar/components/hx-navbar/hx-navbar.nvue"

Vue.component('hx-navbar',hxNavbar)

//把vuex定义成全局组件
Vue.prototype.$store = store
//公共方法
Vue.prototype.util = util
Vue.config.productionTip = false


App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
