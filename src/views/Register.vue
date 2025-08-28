<template>
  <section class="register-page">
    <div class="register-container">
      <h1 class="logo">Pilih-Pilih Shop</h1>
      <h2 class="title">Create Account</h2>
      <p class="subtitle">Join us and start shopping today.</p>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Name</label>
          <input v-model="name" type="text" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        <button type="submit" class="btn-register">Sign Up</button>
      </form>
      <div class="extra-links">
        <router-link to="/login">Already have an account? Sign in</router-link>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { auth } from '../api/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

async function handleRegister() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    alert('Please fill all fields!')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match!")
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, {
      displayName: name.value
    })

    alert("Account created successfully!")
    router.push('/login') 
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #ede9fe, #ffffff, #e0f2fe);
}

.register-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
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

.register-form {
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

.btn-register {
  background: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-register:hover {
  background: #059669;
}

.extra-links {
  margin-top: 1rem;
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
