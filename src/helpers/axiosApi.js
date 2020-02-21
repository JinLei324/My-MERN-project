import axios from 'axios';
import moment from 'moment-timezone';
import { store } from '../store';

const instance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL + '/api/v1',
	timeout: 300000,
	withCredentials: true
});

instance.interceptors.request.use(
	function (config) {
		config.headers['x-timezone'] = moment.tz.guess()
		document.body.style.cursor = 'wait'
		let loading = document.getElementById('loading')
		if (loading)
			loading.className = 'show'

		if (store.getState().authentication.token) {
			config.headers.Authorization = store.getState().authentication.token
		}
		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
instance.interceptors.response.use(
	function (response) {
		// Do something with response data
		setTimeout(() => {
			let loading = document.getElementById('loading')
			if (loading)
				loading.className = 'hide'
			document.body.style.cursor = ''
		}, 0)
		return response
	},
	function (error) {
		// Do something with response error
		setTimeout(() => {
			let loading = document.getElementById('loading')
			if (loading)
				loading.className = 'hide'
			document.body.style.cursor = ''
		}, 0)

		if (
			error.response.status === 401 &&
			store.getState().authentication.token &&
			error.response.headers['x-code-error'] === '401'
		) {
			window.location.href = '/'
			localStorage.removeItem('persist:benefactor-main-store')
		}

		return Promise.reject(error)
	}
)

export default instance
