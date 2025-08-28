<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-left">
        <router-link to="/" class="footer-logo">Pilih-Pilih Shop</router-link>
        <p class="footer-text">Pilih-Pilih Shop: Satu Toko, Sejuta Solusi</p>
      </div>
      <div class="footer-center">
        <router-link to="/products" class="footer-link">
          <i class="fa-solid fa-box"></i> Products
        </router-link>
        <router-link to="/cart" class="footer-link">
          <i class="fa-solid fa-cart-shopping"></i> Cart
        </router-link>
        <router-link to="/login" class="footer-link">
          <i class="fa-solid fa-right-to-bracket"></i> Login
        </router-link>
        <router-link to="/register" class="footer-link">
          <i class="fa-solid fa-user-plus"></i> Register
        </router-link>
      </div>
      <div class="footer-right">
        <a href="https://facebook.com" target="_blank" class="footer-link">
          <i class="fa-brands fa-facebook"></i> Facebook
        </a>
        <a href="https://twitter.com" target="_blank" class="footer-link">
          <i class="fa-brands fa-twitter"></i> Twitter
        </a>
        <a href="https://instagram.com" target="_blank" class="footer-link">
          <i class="fa-brands fa-instagram"></i> Instagram
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} Pilih-Pilih Shop. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: #fff;
  padding: 2rem 1rem 1rem;
  margin-top: 3rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
}

.footer-logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.footer-text {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.85;
}

.footer-center,
.footer-right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: #f1f1f1;
  text-decoration: none;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s, color 0.3s;
}

.footer-link:hover {
  color: #fff;
  transform: translateX(4px);
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1.5rem;
  padding-top: 1rem;
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
