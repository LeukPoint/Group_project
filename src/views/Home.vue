<template>
  <div class="login-page">
    <div class="dynamic-background">
      <div class="shape circle"></div>
      <div class="shape triangle"></div>
      <div class="shape wave"></div>
      <div class="shape diamond"></div>
      <div class="shape hexagon"></div>
    </div>

    <div class="home-container">
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="Search user..." 
          @input="handleSearch"
          class="form-input" 
        >
      </div>

      <!-- 用户列表 -->
      <table v-if="users.length > 0" class="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button 
                v-if="canEdit(user)"
                @click="openEditModal(user)"
                class="btn btn-edit"
              >
                Edit
              </button>
              <button 
                v-if="canDelete(user)"
                @click="handleDelete(user.id)"
                class="btn btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="no-data">
        {{ loading ? 'Loading...' : 'No users found' }}
      </div>

      <!-- 编辑模态框 -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h3>Edit User Info</h3>
          <form @submit.prevent="handleUpdate">
            <div class="form-group">
              <label>New Email:</label>
              <input v-model="editForm.email" type="email" required>
            </div>
            <div class="form-group">
              <label>New Password (leave blank to keep current):</label>
              <input v-model="editForm.newPassword" type="password">
            </div>
            <div class="button-group">
              <button type="submit" :disabled="userStore.loading" class="btn btn-save">
                {{ userStore.loading ? 'Saving...' : 'Save' }}
              </button>
              <button type="button" @click="closeEditModal" class="btn btn-cancel">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 响应式数据
const users = ref([])
const searchQuery = ref('')
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  email: '',
  newPassword: ''
})
const loading = ref(false)

// 计算属性
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// 权限检查
const canEdit = (user) => {
  return userStore.currentUser && 
    (userStore.currentUser.id === user.id || userStore.currentUser.username === 'admin')
}

const canDelete = (user) => {
  return userStore.currentUser && 
    (userStore.currentUser.username === 'admin' || userStore.currentUser.id === user.id)
}

// 生命周期钩子
onMounted(async () => {
  if (!userStore.currentUser) {
    await userStore.initAuth()
  }
  await loadUsers()
})

// 方法
const loadUsers = async () => {
  try {
    loading.value = true
    const response = await api.getUsers('')
    users.value = response.data
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  await loadUsers()
}

const openEditModal = (user) => {
  editForm.value = { ...user, newPassword: '' }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const handleUpdate = async () => {
  try {
    await userStore.updateUser(editForm.value.id, {
      email: editForm.value.email,
      newPassword: editForm.value.newPassword
    })
    await loadUsers()
    closeEditModal()
  } catch (error) {
    console.error('Update failed:', error)
    alert('Update failed: ' + error.message)
  }
}

const handleDelete = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    const currentUserId = userStore.currentUser?.id
    await userStore.deleteUser(userId)

    if (userId === currentUserId) {
      await userStore.logout()
      router.replace('/login').then(() => {
        window.location.reload() // 确保完全状态重置
      })
    } else {
      await loadUsers()
    }
  } catch (error) {
    console.error('Delete failed:', error)
    alert('Delete failed: ' + error.message)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
}

.dynamic-background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  opacity: 0.1;
  animation: float 20s infinite linear;
  will-change: transform;
}

.circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4f46e5, #818cf8);
  left: 10%;
  top: 20%;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 150px solid transparent;
  border-right: 150px solid transparent;
  border-bottom: 260px solid #10b981;
  right: 15%;
  top: 50%;
}

.wave {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #f472b6 20%, transparent 70%);
  left: 50%;
  top: 70%;
}

.diamond {
  width: 250px;
  height: 250px;
  background: linear-gradient(60deg, #f59e0b, #fcd34d);
  transform: rotate(45deg);
  left: 5%;
  top: 70%;
  animation: rotate 25s linear infinite;
  z-index: 1;
}

.hexagon {
  width: 200px;
  height: 220px;
  background: linear-gradient(150deg, #3b82f6, #60a5fa);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  right: 5%;
  top: 10%;
  filter: drop-shadow(0 10px 15px rgba(59, 130, 246, 0.1));
}

.home-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #4CAF50;
  outline: none;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
}

.user-table th,
.user-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-save {
  background: #48bb78;
  color: white;
}

.btn-save:hover {
  background: #38a169;
}

.btn-cancel {
  background: #718096;
  color: white;
}

.btn-cancel:hover {
  background: #4a5568;
}

.btn-edit {
  background: #4299e1;
  color: white;
  margin-right: 0.5rem;
}

.btn-delete {
  background: #f56565;
  color: white;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .home-container {
    margin: 20px;
    padding: 20px;
  }

  .diamond {
    width: 150px;
    height: 150px;
    left: -10%;
  }

  .hexagon {
    width: 120px;
    height: 140px;
    right: -5%;
  }

  .wave {
    width: 300px;
    height: 300px;
  }
}
</style>

