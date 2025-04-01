<template>
    <div class="register-container">
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
            <div>
                <label>username:</label>
                <input v-model="userData.username" required>
            </div>
            <div>
                <label>password:</label>
                <input v-model="userData.password" type="password" required>
            </div>
            <div>
                <label>email:</label>
                <input v-model="userData.email" type="email" required>
            </div>
            <button type="submit" :disabled="userStore.loading">
                {{ userStore.loading ? 'Registering...' : 'Register'}}
            </button>
            <p>Already have an account?<router-link to="/login">Login now</router-link></p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const userData = ref({
    username: '',
    password: '',
    email: ''
})

const handleRegister = async ()=>{
    const success = await userStore.register(userData.value)
    if(success){
        alert('Success! Please login.')
    }
    else{
        alert('Failed to register,your username might have already been taken.')
    }
}
</script>