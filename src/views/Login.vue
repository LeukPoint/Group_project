<template>
  <div class="login-page">
    <h1 class="system-title" @click="refreshPage">User Information Query System</h1>
    <div class="dynamic-background">
      <div class="shape circle"></div>
      <div class="shape triangle"></div>
      <div class="shape wave"></div>
    </div>
    
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <!-- 用户名输入组 -->
        <div class="form-group">
          <label>Username:</label>
          <input 
            v-model="credentials.username" 
            @input="validateUsername"
            required
            class="login-input"
            placeholder="Enter your username"
          >
          <div v-if="usernameError" class="error-tip">{{ usernameError }}</div>
        </div>

        <!-- 密码输入组（新增切换功能） -->
        <div class="form-group password-group">
          <label>Password:</label>
          <div class="password-wrapper">
            <input 
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="login-input"
              placeholder="••••••••"
            >
            
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          :disabled="userStore.loading"
          class="login-btn"
        >
          {{ userStore.loading ? 'Logging in...' : 'Login' }}
        </button>
        <p class="register-link">
          Don't have an account? 
          <router-link to="/register">Register now</router-link>
        </p>
      </form>
    </div>
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
const showPassword = ref(false) // 新增密码可见状态

// 用户名验证逻辑
const usernameError = ref('')
const validateUsername = () => {
  const username = credentials.value.username
  if (username.length < 1) {
    usernameError.value = "Username must be at least 1 characters"
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    usernameError.value = "Only letters, numbers and underscores are allowed"
  } else {
    usernameError.value = ''
  }
}

const handleLogin = async () => {
  validateUsername()
  if (usernameError.value) return
  
  const success = await userStore.login(credentials.value)
  if (!success) {
    alert("Login failed. Please check your credentials.")
  }
}

const refreshPage = () => {
  location.reload()
}

</script>

<style scoped>
/* 公共样式 */
.login-page {
  min-height: 100vh;
  padding: 5vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.system-title {
  text-align: center;
  font-size: calc(2rem + 1.5vw);
  margin: 0 0 5vh;
  font-weight: 700;
  letter-spacing: -0.03em;
  cursor: pointer;
  animation: titleFloat 3s ease-in-out infinite;
  background: linear-gradient(135deg, #6366f1 25%, #8b5cf6 50%, #ec4899 75%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
}

.login-container {
  width: 100%;
  max-width: 500px;
  min-width: 300px;
  padding: 5vh 5vw;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* 表单组件样式 */
.form-group {
  margin-bottom: 3vh;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 1vh;
  color: #4a5568;
  font-weight: 500;
  font-size: calc(0.9rem + 0.3vw);
}

.login-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: calc(0.9rem + 0.3vw);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  box-sizing: border-box;
}

.login-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 12px rgba(74, 144, 226, 0.2);
  background: white;
}

/* 密码输入组特殊样式 */
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
}

.icon-eye,
.icon-eye-off {
  width: 20px;
  height: 20px;
  display: block;
}

/* 登录按钮样式 */
.login-btn {
  width: 100%;
  padding: 12px 16px;
  margin-top: 3vh;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: calc(1rem + 0.3vw);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.25);
}

.login-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 其他辅助样式 */
.register-link {
  text-align: center;
  margin-top: 4vh;
  color: #718096;
  font-size: calc(0.85rem + 0.3vw);
}

.register-link a {
  color: #4a90e2;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #357abd;
}

.error-tip {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
  height: 20px;
  transition: opacity 0.3s;
}

/* 动画 */
@keyframes titleFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1vh) scale(1.03); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    padding: 5vh 3vw;
  }

  .system-title {
    font-size: calc(1.8rem + 1vw);
    margin-bottom: 4vh;
  }

  .login-container {
    padding: 6vh 6vw;
  }
}

@media (max-width: 480px) {
  .login-input,
  .login-btn {
    padding: 10px 14px;
    font-size: 1rem;
  }
  
  .toggle-password {
    right: 8px;
  }
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

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
.divider {
  color: #94a3b8;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.social-buttons {
  display: grid;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.google { color: #db4437; }
.github { color: #333; }
</style>

