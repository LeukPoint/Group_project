<template>
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
            <!-- 编辑按钮（自己或管理员可见） -->
            <button 
              v-if="canEdit(user)"
              @click="openEditModal(user)"
              class="btn btn-edit"
            >
              Edit
            </button>
            
            <!-- 删除按钮（自己或管理员可见） -->
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
            <button type="submit" :disabled="userStore.loading" class="btn btn-save">
              {{ userStore.loading ? 'saving' : 'save' }}
            </button>
            <button type="button" @click="closeEditModal" class="btn btn-cancel">cancel</button>
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
import { useRouter } from 'vue-router' // 新增路由导入

const userStore = useUserStore()
const router = useRouter() // 获取路由实例

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
  if(!userStore.currentUser) return false
  return userStore.currentUser.id === user.id || 
         userStore.currentUser.username === 'admin'
}

const canDelete = (user) => {
  if(!userStore.currentUser) return false
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

// 删除用户（修改部分）
const handleDelete = async (userId) => {
  if (!confirm('确定要删除该用户吗？')) return
  try {
    await userStore.deleteUser(userId)
    
    // 清除用户状态（重要！）
    userStore.logout() // 确保用户Store有logout方法
    
    // 跳转到登录页面
    router.push('/login') // 根据实际路由路径调整
    
  } catch (error) {
    console.error('Failed to delete:', error)
  }
}
</script>

<style scoped>
.home-container {
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
}

.user-table th,
.user-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
}

.no-data {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 100%;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

.button-group button {
  flex: 1;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn {
  border: none;
  outline: none;
}

.btn-edit {
  background-color: #007bff;
  color: white;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}
</style>

