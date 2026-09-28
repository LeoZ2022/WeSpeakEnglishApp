import { apiResquest } from '../util/http.js'

//POST 

export const login = (query) => {	
	return apiResquest({
		url: '/api/index/login',
		method: 'POST',
		query: query
	})
}

export const loginFast = (query) => {	
	return apiResquest({
		url: '/api/index/login_fast',
		method: 'POST',
		query: query
	})
}



export const inRoom = (query) => {
	return apiResquest({
		url: '/api/member/in_room',
		method: 'POST',
		query: query
	})
}

export const outRooms = (query) => {	
	return apiResquest({
		url: '/api/member/out_room',
		method: 'POST',
		query: query
	})
}

export const commentClass = (query) => {	
	return apiResquest({
		url: '/api/member/comment_class',
		method: 'POST',
		query: query
	})
}

export const classBegin = (query) => {	
	return apiResquest({
		url: '/api/member/class_begin',
		method: 'POST',
		query: query
	})
}




export const findpass  = (query) => {
	let str = query
	return apiResquest({
		url: `/api/index/findpass?${str}`,
		method: 'GET'
	})
}

export const getClassOne  = (id) => {
	console.log('kcsssss')
	return apiResquest({
		url: '/api/member/get_class_one?id='+id,
		method: 'GET'
	})
}


export const classList  = (query) => {
	let str = query
	return apiResquest({
		url: `/api/member/get_class_list?${str}`,
		method: 'GET'
	})
}

export const getConfig  = (query) => {
	let str = query
	return apiResquest({
		url: '/api/index/getConfig',
		method: 'GET'
	})
}


export const setPushId  = (id) => {
	return apiResquest({
		url: '/api/member/set_push_id?push_id='+id,
		method: 'GET'
	})
}

export const getUpgrade  = () => {
	return apiResquest({
		url: '/api/index/get_upgrade',
		method: 'GET'
	})
}


export const getArticle = (type) => {
	return apiResquest({
		url: '/api/index/get_article?act='+type,
		method: 'GET'
	})
}


export const tousu = (query) => {	
	return apiResquest({
		url: '/api/index/tousu',
		method: 'POST',
		query: query
	})
}


export const logout = () => {
	return apiResquest({
		url: '/api/member/logout',
		method: 'GET'
	})
}

export const cancelArticle = () => {
	return apiResquest({
		url: '/api/index/get_cancel_article',
		method: 'GET'
	})
}

export const geturl = () => {
	return apiResquest({
		url: '/api/index/get_config',
		method: 'GET'
	})
}




//GET 
export const validateCode  = (query) => {
	let str = query
	return apiResquest({
		url: `您的API地址 ?${str}`,
		method: 'GET'
	})
}