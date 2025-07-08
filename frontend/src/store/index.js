import { createStore } from "vuex"
import axios from "axios"

export default createStore({
	state: {
		user: {
			username: null,
			roles: [],
			status: null,
		},
	},
	getters: {
		isAuthenticated: state => !!state.user.username,
		username: state => state.user.username,
		roles: state => state.user.roles,
		status: state => state.user.status,
		isEditor: state => state.user.roles.includes('Editor'),
		isAdmin: state => state.user.roles.includes('Admin'),
	},
	mutations: {
		SET_USER(state, payload) {
			state.user = payload
		},
		CLEAR_USER(state) {
			state.user = { username: null, roles: [], status: null }
		},
	},
	actions: {
		async login({ commit }, username) {
			const { data } = await axios.post(`/api/users/login/${username}`)
			axios.defaults.headers.common['token'] = data.username
			commit('SET_USER', data)
		},
		logout({ commit }) {
			delete axios.defaults.headers.common['token']
			commit('CLEAR_USER')
		},
	},
})
