<template>
  <div class="app-container">
    <nav v-if="showNavigation" class="navbar">
      <div class="nav-brand">
        <router-link to="/home">User Management System</router-link>
      </div>
      <div class="nav-items">
        <div class="user-info" v-if="userStore.currentUser">
          Welcome,{{ userStore.currentUser.username }}
          <span v-if="userStore.currentUser.username === 'admin'">(admin)</span>
        </div>
        <button @click="userStore.logout" class="logout-btn">logout</button>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <div v-if="userStore.loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">loading...</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'
import { onMounted, computed } from 'vue'

const userStore = useUserStore()
const route = useRoute()

const showNavigation = computed(() => {
  return route.meta.requiresAuth && userStore.currentUser
})

onMounted(() => {
  userStore.initAuth()
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-info {
  font-size: 0.95rem;
  opacity: 0.9;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 95%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  gap: 1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #2c3e50;
  font-size: 1.1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .nav-items {
    flex-direction: column;
    gap: 1rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style>
