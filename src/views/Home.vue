<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <!-- 搜索框 -->
    <div class="search-box">
      <input 
        v-model="searchQuery" 
        placeholder="search user..."
        @input="handleSearch"
      >
    </div>

    <!-- 用户列表 -->
    <table v-if="users.length > 0">
      <thead>
        <tr>
          <th>username</th>
          <th>email</th>
          <th>operation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <!-- 编辑按钮（自己或管理员可见） -->
            <button 
              v-if="canEdit(user)"
              @click="openEditModal(user)"
            >
              Edit
            </button>
            
            <!-- 删除按钮（自己或管理员可见） -->
            <button 
              v-if="canDelete(user)"
              @click="handleDelete(user.id)"
              class="delete-btn"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="no-data">
      {{ loading ? 'loading' : 'No users data now' }}
    </div>

    <!-- 编辑模态框 -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit user info</h3>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label>new email:</label>
            <input v-model="editForm.email" type="email" required>
          </div>
          <div class="form-group">
            <label>new password (Leave blank means no changes will be make)</label>
            <input v-model="editForm.newPassword" type="password">
          </div>
          <div class="button-group">
            <button type="submit" :disabled="userStore.loading">
              {{ userStore.loading ? 'saving' : 'save' }}
            </button>
            <button type="button" @click="closeEditModal">cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import api from '@/api'

const userStore = useUserStore()

// 响应式数据
const users = ref([])
const searchQuery = ref('')
const showEditModal = ref(false)
const editForm = ref({
  id: null,
  email: '',
  newPassword: ''
})

// 计算属性：过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// 权限判断
const canEdit = (user) => {
  if(!userStore.currentUser){
    return false
  }
  return userStore.currentUser.id === user.id || 
         userStore.currentUser.username === 'admin'
}


const canDelete = (user) => {
  if(!userStore.currentUser){
    return false
  }
  return userStore.currentUser.username === 'admin' || 
         userStore.currentUser.id === user.id
}

const isUserReady = ref(false)

// 初始化加载数据
onMounted(async () => {
  if(!userStore.currentUser){
    await userStore.initAuth()
  }
  isUserReady.value = true
  await loadUsers()
})

// 加载用户数据
const loadUsers = async () => {
  try {
    const response = await api.getUsers('')
    users.value = response.data
  } catch (error) {
    console.error('Fail to load users:', error)
  }
}

// 搜索处理
const handleSearch = async () => {
  await loadUsers()
}

// 打开编辑模态框
const openEditModal = (user) => {
  editForm.value = {
    id: user.id,
    email: user.email,
    newPassword: ''
  }
  showEditModal.value = true
}

// 关闭模态框
const closeEditModal = () => {
  showEditModal.value = false
}

// 更新用户信息
const handleUpdate = async () => {
  try {
    await userStore.updateUser(editForm.value.id, {
      email: editForm.value.email,
      newPassword: editForm.value.newPassword
    })
    await loadUsers()
    closeEditModal()
  } catch (error) {
    console.error('Failed to Update:', error)
  }
}

// 删除用户
const handleDelete = async (userId) => {
  if (!confirm('确定要删除该用户吗？')) return
  try {
    await userStore.deleteUser(userId)
    await loadUsers()
  } catch (error) {
    console.error('Failed to delete:', error)
  }
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 8px;
}
</style>