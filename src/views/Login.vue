<template>
  <section class="login-page">
    <div class="login-container">
      <h1 class="logo">Pilih-Pilih Shop</h1>
      <h2 class="title">Login</h2>
      <p class="subtitle">Welcome back! Please sign in.</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>

        <button type="submit" class="btn-login">Sign In</button>
      </form>
      <div class="extra-links">
        <router-link to="/register">Create account</router-link>
        <router-link to="/forgot-password">Forgot password?</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../api/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

async function handleLogin() {
  if (!email.value || !password.value) {
    alert('Please fill all fields!')
    return
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log("Login success:", userCredential.user)
    alert("Welcome back " + userCredential.user.email)
    router.push("/") 
  } catch (error) {
    console.error("Login error:", error.message)
    alert("Login failed: " + error.message)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2fe, #ffffff, #ede9fe);
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
}

.subtitle {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
}

.form-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
}

.btn-login {
  background: #6366f1;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover {
  background: #4f46e5;
}

.extra-links {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}
.extra-links a {
  color: #6366f1;
  text-decoration: none;
}
.extra-links a:hover {
  text-decoration: underline;
}
</style>
