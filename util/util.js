import store from "@/store/store"
//存储
// localStorage.setItem("key", "value");

//读取
// var lastname = localStorage.getItem("key");

//删除
// localStorage.removeItem("key");

export default{
	
	isLogin(){		
		console.log('login----')
		const value = uni.getStorageSync('userInfo'); 
		if (value) {
		    store.commit("login", value)			
		}else{
			uni.navigateTo({
				url: '/pages/login/index',
				animationType: 'fade-in'
			})
		}		
	},
	// 24小时转12小时
	dateTonum: function (dt) {
		var hours = dt.split(":")[0];
		//console.log(hours,'------')
		if(hours != 12){
			
			hours = (hours % 12)
		}
		
		// if(hours == 0){
		// 	hours = 12
		// }
		var minutes = dt.split(":")[1];
		var finalTime = hours + ":" + minutes
		return finalTime
	},
	//PM AM换算
	timeFrame: function (dt) {
		var hours = dt.split(":")[0];
		// var AmOrPm = hours >= 12 ? 'PM' : 'AM';
		var AmOrPm = ''
		if(hours >= 12){
			AmOrPm = 'PM'
		}else{
			AmOrPm = 'AM'
		}
		return AmOrPm
	},
	//倒计时
	countdown(st,et){
		var date = et - st; //得出的为秒数；
		var newDate = '00:00:00'
		console.log(date)
		var time = setInterval(function(){
			// var timedate = new Date("2021/5/28,14:32:55"); //自定义结束时间
			// var now = new Date(); //获取当前时间
			// var date = parseInt(timedate.getTime() - now.getTime()) / 1000; //得出的为秒数；
			date--	
			 
			if (date <= 0) {
				//倒计时结束
				clearInterval(time);	
				_this.newTime = "00:00:00"
				return
			}
			var day = parseInt(date / 60 / 60 / 24);
			var hour = parseInt(date / 60 / 60 % 24);
			var minute = parseInt(date / 60 % 60);
			var second = parseInt(date % 60);
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
			return newDate = day + ":" +hour + ":" + minute +":"+ second;
			 
		}, 1000);
	},
	htmlDecodeByRegExp:function (str){  
		var s = "";
		if(str.length == 0) return "";
		s = str.replace(/&amp;/g,"&");
		s = s.replace(/&lt;/g,"<");
		s = s.replace(/&gt;/g,">");
		s = s.replace(/&nbsp;/g," ");
		s = s.replace(/&#39;/g,"\'");
		s = s.replace(/&quot;/g,"\"");
		return s;  
	},
	timeToStamp(d){
		var date = d.split(":"),
			hours = date[0]*60*60,
			points = date[1]*60;
		return hours+points;
		
	}

	
}
