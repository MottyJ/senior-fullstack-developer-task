import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import EditorView from '../views/EditorView.vue'
import AdminView from '../views/AdminView.vue'
import store from '@/store'

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login,
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
	},
	{
		path: '/editor',
		name: 'Editor',
		component: EditorView,
		meta: { roles: ['Editor', 'Admin'] },
	},
	{
		path: '/admin',
		name: 'Admin',
		component: AdminView,
		meta: { roles: ['Admin'] },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const isAuth = store.getters.isAuthenticated
	const roles = store.getters.roles

	if (!isAuth && to.name !== 'Login') {
		return next({ name: 'Login' })
	}

	if (to.meta.roles) {
		const allowed = roles.some(r => to.meta.roles.includes(r))
		if (!allowed) {
			return next({ name: 'Home' })
		}
	}

	next()
})

export default router
