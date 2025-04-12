<template>
  <div class="register-page">
    <!-- 动态背景 -->
    <div class="dynamic-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <h1 class="system-title" @click="refreshPage">User Information Query System</h1>

    <div class="register-container">
      <form @submit.prevent="handleRegister" class="animated-form">
        <!-- 用户名 -->
        <div class="form-group floating-label">
          <input 
            v-model="userData.username" 
            required 
            class="form-input"
            @input="clearError('username')"
            placeholder=" "
          >
          <label>Username</label>
          <div class="input-decoration"></div>
        </div>

        <!-- 密码 -->
        <div class="form-group floating-label">
          <input 
            v-model="userData.password" 
            type="password" 
            required 
            class="form-input"
            @input="clearError('password')"
            placeholder=" "
          >
          <label>Password</label>
          <div class="input-decoration"></div>
        </div>

        <!-- 邮箱 -->
        <div class="form-group floating-label">
          <input 
            v-model="userData.email" 
            type="email" 
            required 
            class="form-input"
            @input="validateEmail"
            @blur="validateEmail"
            placeholder=" "
          >
          <label>Email</label>
          <div class="input-decoration"></div>
          <div v-if="emailError" class="error-msg animated-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ emailError }}
          </div>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          :disabled="!isFormValid || userStore.loading" 
          class="submit-btn neon-btn"
        >
          <span v-if="!userStore.loading">
            <i class="fas fa-user-plus"></i> Register
          </span>
          <div v-else class="loading-pulse">
            <div class="pulse-dot"></div>
            <div class="pulse-dot"></div>
            <div class="pulse-dot"></div>
          </div>
        </button>
        
        <!-- 登录链接 -->
        <p class="login-link">
          Already have an account? 
          <router-link to="/login" class="hover-underline">
            Login now
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </p>
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
    emailError.value = 'Please enter a valid email address';
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
    alert('Registered successfully! Please log in');
    userData.value = { 
      username: '', 
      password: '', 
      email: ''
    };
  } else {
    alert('Registration failed. The user name may already be in use');
  }
};

// 刷新页面
const refreshPage = () => {
  location.reload();
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 5vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
  position: relative;
  overflow: hidden;
}

.dynamic-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  backdrop-filter: blur(5px);
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 5%;
  animation-duration: 25s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 70%;
  left: 80%;
  animation-duration: 30s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  top: 40%;
  left: 70%;
  animation-duration: 35s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  top: 20%;
  left: 85%;
  animation-duration: 40s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, 10px) rotate(5deg); }
  50% { transform: translate(-10px, 15px) rotate(-5deg); }
  75% { transform: translate(5px, -10px) rotate(3deg); }
}

.system-title {
  position: relative;
  z-index: 2;
  text-align: center;
  font-size: calc(2rem + 1.5vw);
  margin: 0 0 5vh;
  font-weight: 700;
  letter-spacing: -0.03em;
  cursor: pointer;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.system-title:hover {
  transform: scale(1.02);
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
}

.register-container {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: translateY(20px);
  opacity: 0;
  animation: formEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes formEntrance {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.floating-label {
  position: relative;
  margin-bottom: 2rem;
}

.floating-label label {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #666;
  pointer-events: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.floating-label input:focus ~ label,
.floating-label input:not(:placeholder-shown) ~ label {
  transform: translateY(-1.8rem) scale(0.85);
  color: #af4c5c;
}

.form-input {
  width: 90%;
  padding: 1.2rem;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

.form-input:focus {
  border-color: #af4c5c;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
  background: white;
  padding-left: 1.5rem;
}

.input-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3;
  height: 3px;
  background: #af4c5c;
  transition: width 0.3s ease;
}

.form-input:focus ~ .input-decoration {
  width: 100%;
}

.error-msg {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 5px;
  transform: translateY(-10px);
  opacity: 0;
  animation: errorShow 0.3s ease forwards;
}

@keyframes errorShow {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fa-exclamation-circle {
  margin-right: 0.5rem;
}

.neon-btn {
  width: 100%;
  padding: 1.2rem 2rem;
  background: linear-gradient(45deg, #af4c5c, #af4c5c);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.neon-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

.neon-btn:not(:disabled):active {
  transform: translateY(1px);
}

.neon-btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-pulse {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.2s infinite ease-in-out;
}

.pulse-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.pulse-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.hover-underline {
  position: relative;
  padding-bottom: 2px;
}

.hover-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.hover-underline:hover::after {
  width: 100%;
}

.fa-arrow-right {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.hover-underline:hover .fa-arrow-right {
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .register-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .shape {
    display: none;
  }
  
  .system-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
}
.system-title {
  animation: titleFloat 3s ease-in-out infinite; /* 应用动画 */
}

@keyframes titleFloat {
  0%, 100% { 
    transform: translateY(0) scale(1); 
  }
  50% { 
    transform: translateY(-1vh) scale(1.03); /* Y轴位移 + 缩放效果 */
  }
}
.shape {
  animation: float 20s infinite linear; /* 通用形状动画 */
}

@keyframes float {
  0% { 
    transform: translateY(0) rotate(0deg); 
  }
  50% { 
    transform: translateY(-30px) rotate(180deg); /* Y轴位移 + 旋转 */
  }
  100% { 
    transform: translateY(0) rotate(360deg); 
  }
}
</style>

