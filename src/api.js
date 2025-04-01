import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
})

export default{
    getMe: ()=>api.get('/me'),
    register: (userData)=>api.post('/register',userData),
    login: (credentials)=>api.post('/login',credentials),
    getUsers: (search)=>api.get('/users',{params:{search}}),
    updateUser: (id, data)=>api.put(`/users/${id}`,data),
    deleteUser: (id)=>api.delete(`/users/${id}`),
    logout:()=>api.post('/logout')
}