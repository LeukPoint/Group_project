import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api";
import router from "@/router";

export const useUserStore = defineStore('user', ()=>{
    const currentUser = ref(null)
    const loading = ref(false)

    const initAuth = async ()=>{
        try{
            loading.value = true
            const response = await api.get('/me')
            currentUser.value = response.data
        }
        catch{
            currentUser.value = null
        }
        finally{
            loading.value = false
        }
    }

    const login = async (credentials)=>{
        try{
            loading.value = true
            const response = await api.login(credentials)
            currentUser.value = response.data.user 
            router.push('/home')
            return true
        }
        catch(error){
            console.error('Failed to login:',error)
            return false
        }
        finally{
            loading.value = false
        }
    }

    const register = async (userData)=>{
        try{
            loading.value = true
            await api.register(userData)
            router.push('/login')
            return true
        }
        catch(error){
            console.error('Failed to register:',error)
            return false
        }
        finally{
            loading.value = false
        }
    }

    const logout = async ()=>{
        try{
            loading.value = true
            await api.logout()
            currentUser.value = null
            router.push('/login')
        }
        catch(error){
            console.error('Failed to logout:', error)
        }
        finally{
            loading.value = false
        }
    }

    const updateUser = async (userId,data)=>{
        try{
            loading.value = true
            const response = await api.updateUser(userId,data)
            if(userId === currentUser.value?.id){
                currentUser.value = response.data.user
                await api.logout()
                router.push('/login').then(()=>{
                    window.location.reload()
                })
            }
            return true
        }
        catch(error){
            console.error('Failed to update:', error)
            return false
        }
        finally{
            loading.value = false
        }
    }

    const deleteUser = async (userId)=>{
        try{
            loading.value = true
            await api.deleteUser(userId)
            if(userId === currentUser.value?.id){
                currentUser.value = null
                await api.logout()
                router.push('/login').then(()=>{
                    window.location.reload()
                })
            }
            return true
        }
        catch(error){
            console.error('Failed to delete:', error)
            return false
        }
        finally{
            loading.value = false
        }
    }

    return{
        currentUser,
        loading,
        initAuth,
        login,
        register,
        logout,
        updateUser,
        deleteUser
    }
})