<template>
    <div class="login-page">
      <h1 class="system-title" @click="refreshPage">User Information Query System</h1>
  
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Username:</label>
            <input 
              v-model="credentials.username" 
              required
              class="login-input"
              placeholder="Enter your username"
            >
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input 
              v-model="credentials.password" 
              type="password" 
              required
              class="login-input"
              placeholder="••••••••"
            >
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
  
  const handleLogin = async () => {
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
  /* 新增盒模型统一设置 */
  .login-input,
  .login-btn {
    box-sizing: border-box;
  }
  
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
    background: linear-gradient(
      135deg,
      #6366f1 25%,
      #8b5cf6 50%,
      #ec4899 75%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: transform 0.3s ease;
  }
  
  @keyframes titleFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-1vh) scale(1.03); }
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
  
  .login-container h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 4vh;
    font-size: calc(1.5rem + 0.5vw);
  }
  
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
  
  /* 统一输入框样式 */
  .login-input {
    width: 100%;
    padding: 12px 16px;  /* 保持与按钮相同的左右padding */
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: calc(0.9rem + 0.3vw);
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .login-input:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 12px rgba(74, 144, 226, 0.2);
    background: white;
  }
  
  /* 统一按钮样式 */
  .login-btn {
    width: 100%;
    padding: 12px 16px;  /* 与输入框相同的左右padding */
    margin-top: 3vh;
    background: linear-gradient(135deg, #4a90e2, #357abd);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: calc(1rem + 0.3vw);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
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
      padding: 10px 14px;  /* 移动端保持相同padding */
      font-size: 1rem;
    }
  }
  </style>

