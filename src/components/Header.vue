<template>
  <header class="header">
    <div class="container nav">
      <div class="left">
        <router-link to="/" class="logo">Pilih-Pilih Shop</router-link>
      </div>
<nav class="right desktop-nav">
  <router-link to="/products" class="nav-link">Products</router-link>
  <router-link to="/cart" class="nav-link cart-link cart-icon">
  🛒 Cart <span class="cart-badge">{{ totalItems }}</span>
</router-link>
  <template v-if="user">
    <span class="nav-link">👋 Halo, {{ user.displayName || user.email }}</span>
    <button @click="handleLogout" class="logout-btn">
  <i class="fas fa-sign-out-alt"></i> Logout
</button>
  </template>
  <template v-else>
    <router-link to="/login" class="nav-link">Login</router-link>
    <router-link to="/register" class="nav-link">Register</router-link>
  </template>
</nav>
      <button class="menu-btn" @click="toggleMenu">
        ☰
      </button>
    </div>
<nav v-if="menuOpen" class="mobile-nav">
  <router-link to="/products" class="nav-link" @click="closeMenu">Products</router-link>
  <router-link to="/cart" class="nav-link cart-link cart-icon" @click="closeMenu">
  🛒 Cart <span class="cart-badge">{{ totalItems }}</span>
</router-link>

  <template v-if="user">
    <span class="nav-link">👋 Halo, {{ user.displayName || user.email }}</span>
   <button @click="handleLogout" class="logout-btn">
  <i class="fas fa-sign-out-alt"></i> Logout
</button>
  </template>
  <template v-else>
    <router-link to="/login" class="nav-link" @click="closeMenu">Login</router-link>
    <router-link to="/register" class="nav-link" @click="closeMenu">Register</router-link>
  </template>
</nav>

  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../store/cart'
import { storeToRefs } from 'pinia'
import { auth } from '../api/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const cartBadge = ref(null)
const cart = useCartStore()
const { totalItems } = storeToRefs(cart)

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

const router = useRouter()
const user = ref(null)
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

const handleLogout = async () => {
  try {
    await signOut(auth) 
    router.push('/login') 
  } catch (error) {
    console.error('Logout error:', error.message)
  }
}
watch(totalItems, () => {
  if (cartBadge.value) {
    cartBadge.value.classList.remove('animate')
    void cartBadge.value.offsetWidth
    cartBadge.value.classList.add('animate')
  }
})
</script>

<style scoped>
.logout-btn {
  margin-left: 12px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background-color: #e63946; 
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px; 
}

.logout-btn:hover {
  background-color: #c92a36;
}

.logout-btn i {
  font-size: 14px;
}
</style>

