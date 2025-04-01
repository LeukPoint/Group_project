<template>
    <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
            <div>
                <label>username:</label>
                <input v-model="credentials.username" required>
            </div>
            <div>
                <label>password:</label>
                <input v-model="credentials.password" type="password" required>
            </div>
            <button type="submit" :disabled="userStore.loading">
                {{ userStore.loading ? 'logging in...' : 'login' }}
            </button>
            <p>Don't have an account?<router-link to="/register">Register now</router-link></p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const credentials = ref({
    username: '',
    password: ''
})

const handleLogin = async ()=>{
    const success = await userStore.login(credentials.value)
    if(!success){
        alert("Fail to login, please check your username and password.")
    }
}
</script>