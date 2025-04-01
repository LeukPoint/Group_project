import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from "@/views/Register.vue";
import { useUserStore } from "@/stores/userStore";

const routes = [
    {
        path: '/',
        redirect: () => {
            const store = useUserStore()
            return store.currentUser ? '/home' : '/login'
        }
    },
    {
        path: '/home',
        component: Home,
        meta: {requiresAuth:true}
    },
    {
        path: '/login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        component: Register,
        meta: { guestOnly: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to)=>{
    const store = useUserStore()

    if(!store.currentUser){
        await store.initAuth()
    }
    if(to.meta.requiresAuth&&!store.currentUser){
        return '/login'
    }
    if(to.meta.guestOnly&&store.currentUser){
        return '/home'
    }
})

export default router