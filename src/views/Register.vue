<template>
  <div class="register-page">
    <h1 class="system-title" @click="refreshPage">User Information Query System</h1>

    <div class="register-container">
      <form @submit.prevent="handleRegister">
        <!-- 用户名 -->
        <div class="form-group">
          <label>Username:</label>
          <input 
            v-model="userData.username" 
            required 
            class="form-input"
            @input="clearError('username')"
          >
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label>Password:</label>
          <input 
            v-model="userData.password" 
            type="password" 
            required 
            class="form-input"
            @input="clearError('password')"
          >
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="userData.email" 
            type="email" 
            required 
            class="form-input"
            @input="validateEmail"
            @blur="validateEmail"
          >
          <p v-if="emailError" class="error-msg">
            <span class="error-icon">!</span> {{ emailError }}
          </p>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          :disabled="!isFormValid || userStore.loading" 
          class="submit-btn"
        >
          {{ userStore.loading ? 'Registering...' : 'Register' }}
          <span v-if="userStore.loading" class="loader"></span>
        </button>
        
        <!-- 登录链接 -->
        <p class="login-link">Already have an account? <router-link to="/login">Login now</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const userData = ref({ 
  username: '',
  password: '',
  email: ''
});
const emailError = ref('');

// 表单有效性计算属性
const isFormValid = computed(() => {
  const fieldsNotEmpty = (
    userData.value.username.trim() !== '' &&
    userData.value.password.trim() !== '' &&
    userData.value.email.trim() !== ''
  );
  
  const validationsPassed = (
    emailError.value === ''
  );
  
  return fieldsNotEmpty && validationsPassed;
});

// 邮箱验证
const validateEmail = () => {
  const email = userData.value.email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.value = '请输入有效的邮箱地址';
  } else {
    emailError.value = '';
  }
};

// 清除错误
const clearError = (field) => {
  switch (field) {
    case 'email':
      emailError.value = '';
      break;
    case 'username':
    case 'password':
      emailError.value = '';
      break;
    default:
      break;
  }
};

// 注册处理
const handleRegister = async () => {
  if (!isFormValid.value) return;

  const success = await userStore.register(userData.value);
  if (success) {
    alert('注册成功！请登录');
    userData.value = { 
      username: '', 
      password: '', 
      email: ''
    };
  } else {
    alert('注册失败，用户名可能已被使用');
  }
};

// 刷新页面
const refreshPage = () => {
  location.reload();
};
</script>

<style scoped>
.login-input,
.login-btn {
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  padding: 5vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ffa856 0%, #ffd283 100%);
}

.system-title {
  text-align: center;
  font-size: calc(2rem + 1.5vw);
  margin: 0 0 5vh;
  font-weight: 700;
  letter-spacing: -0.03em;
  cursor: pointer;
  animation: titleFloat 3s ease-in-out infinite;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

@keyframes titleFloat {
  0%, 100% { 
    transform: translateY(0) scale(1); 
  }
  50% { 
    transform: translateY(-1vh) scale(1.03);
  }
}

.register-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.form-group {
  margin-bottom: 1.8rem;
}

.form-input {
  width: 95%;
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

.error-msg {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

.error-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #ff7e5f, #ff4e50);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover {
  filter: brightness(0.95);
}

.submit-btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 1s linear infinite;
  margin-left: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #ff6b6b;
  text-decoration: underline;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #ff4444;
}

@media (max-width: 480px) {
  .system-title {
    font-size: 2rem;
  }
}
</style>
