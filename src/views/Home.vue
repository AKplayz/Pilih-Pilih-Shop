<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h2 class="hero-title animate-fade-in">Welcome to Pilih-Pilih Shop</h2>
        <p class="hero-subtitle animate-fade-in-delay">
          This market is sponsored By <strong>Platzi Fake API</strong>
        </p>
        <router-link to="/products" class="hero-btn animate-fade-in-delay-2"
          >Browse Products</router-link
        >
      </div>

      <!-- Animated Wave Layers -->
      <div class="wave-container">
        <div class="wave wave1">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(255,255,255,0.1)"
              d="M0,160L60,176C120,192,240,224,360,234.7C480,245,600,235,720,213.3C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div class="wave wave2">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(255,255,255,0.2)"
              d="M0,256L60,245.3C120,235,240,213,360,197.3C480,181,600,171,720,170.7C840,171,960,181,1080,170.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div class="wave wave3">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              d="M0,288L60,277.3C120,267,240,245,360,229.3C480,213,600,203,720,202.7C840,203,960,213,1080,202.7C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Floating particles -->
      <div class="particles">
        <div class="particle" v-for="n in 15" :key="n"></div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">{{ animatedStats.products }}+</div>
          <div class="stat-label">Products</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ animatedStats.customers }}+</div>
          <div class="stat-label">Happy Customers</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ animatedStats.categories }}+</div>
          <div class="stat-label">Categories</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ animatedStats.rating }}</div>
          <div class="stat-label">Average Rating</div>
        </div>
      </div>
    </section>

    <section class="featured">
      <h2 class="section-title">Featured Products</h2>

      <!-- Loading Skeletons -->
      <div v-if="isLoading" class="featured-grid">
        <div v-for="n in 3" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-price"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>

      <!-- Actual Products -->
      <div v-else class="featured-grid">
        <div
          v-for="(product, index) in featured"
          :key="product.id"
          class="card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-img-container">
            <img
              :src="product.images?.[0]"
              alt="Product image"
              class="card-img"
            />
            <div class="card-overlay">
              <router-link
                :to="`/products/${product.id}`"
                class="quick-view-btn"
              >
                Quick View
              </router-link>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ product.title }}</h3>
            <p class="card-price">$ {{ product.price }}</p>
            <div class="card-rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star">★</span>
              </div>
              <span class="rating-text">4.5 (24 reviews)</span>
            </div>
            <router-link :to="`/products/${product.id}`" class="card-link">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="newsletter-content">
        <h3>Stay Updated</h3>
        <p>Get notified about new products and exclusive offers</p>
        <div class="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
            v-model="email"
            class="newsletter-input"
          />
          <button
            @click="subscribeNewsletter"
            class="newsletter-btn"
            :disabled="isSubscribing"
          >
            <span v-if="!isSubscribing">Subscribe</span>
            <div v-else class="loading-spinner"></div>
          </button>
        </div>
        <p
          v-if="subscriptionMessage"
          class="subscription-message"
          :class="subscriptionStatus"
        >
          {{ subscriptionMessage }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { fetchProducts } from "../api/products";

const featured = ref([]);
const isLoading = ref(true);
const email = ref("");
const isSubscribing = ref(false);
const subscriptionMessage = ref("");
const subscriptionStatus = ref("");

const animatedStats = reactive({
  products: 0,
  customers: 0,
  categories: 0,
  rating: 0,
});

const targetStats = {
  products: 200,
  customers: 1500,
  categories: 12,
  rating: 4.8,
};

function animateNumber(target, current, key, duration = 2000) {
  const start = Date.now();
  const startValue = current;

  const updateNumber = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);

    if (key === "rating") {
      animatedStats[key] = (
        startValue +
        (target - startValue) * progress
      ).toFixed(1);
    } else {
      animatedStats[key] = Math.floor(
        startValue + (target - startValue) * progress
      );
    }

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    }
  };

  updateNumber();
}

async function subscribeNewsletter() {
  if (!email.value) return;

  isSubscribing.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  subscriptionMessage.value = "Successfully subscribed!";
  subscriptionStatus.value = "success";
  email.value = "";
  isSubscribing.value = false;

  setTimeout(() => {
    subscriptionMessage.value = "";
    subscriptionStatus.value = "";
  }, 3000);
}

onMounted(async () => {
  try {
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const products = await fetchProducts();
    featured.value = products.slice(0, 3);
    isLoading.value = false;

    // Animate stats
    setTimeout(() => {
      animateNumber(targetStats.products, 0, "products");
      animateNumber(targetStats.customers, 0, "customers");
      animateNumber(targetStats.categories, 0, "categories");
      animateNumber(targetStats.rating, 0, "rating");
    }, 500);
  } catch (e) {
    console.error("Failed to fetch featured products:", e);
    isLoading.value = false;
  }
});
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a74da, #42b883, #0a74da);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  color: white;
  text-align: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-content {
  z-index: 3;
  max-width: 600px;
  position: relative;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 12px;
  font-weight: bold;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.hero-btn {
  background: white;
  color: #0a74da;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Wave Animations */
.wave-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
  z-index: 1;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wave svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 150px;
}

.wave1 {
  animation: wave1 8s ease-in-out infinite;
}

.wave2 {
  animation: wave2 12s ease-in-out infinite reverse;
}

.wave3 {
  animation: wave3 6s ease-in-out infinite;
}

@keyframes wave1 {
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translateX(-25px) translateY(-5px);
  }
}

@keyframes wave2 {
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translateX(15px) translateY(-8px);
  }
}

@keyframes wave3 {
  0%,
  100% {
    transform: translateX(0px) translateY(0px);
  }
  50% {
    transform: translateX(-15px) translateY(-3px);
  }
}

/* Floating Particles */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 20s infinite;
}

.particle:nth-child(1) {
  width: 4px;
  height: 4px;
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  width: 6px;
  height: 6px;
  left: 20%;
  animation-delay: 2s;
}
.particle:nth-child(3) {
  width: 3px;
  height: 3px;
  left: 30%;
  animation-delay: 4s;
}
.particle:nth-child(4) {
  width: 5px;
  height: 5px;
  left: 40%;
  animation-delay: 6s;
}
.particle:nth-child(5) {
  width: 4px;
  height: 4px;
  left: 50%;
  animation-delay: 8s;
}
.particle:nth-child(6) {
  width: 6px;
  height: 6px;
  left: 60%;
  animation-delay: 10s;
}
.particle:nth-child(7) {
  width: 3px;
  height: 3px;
  left: 70%;
  animation-delay: 12s;
}
.particle:nth-child(8) {
  width: 5px;
  height: 5px;
  left: 80%;
  animation-delay: 14s;
}
.particle:nth-child(9) {
  width: 4px;
  height: 4px;
  left: 90%;
  animation-delay: 16s;
}
.particle:nth-child(10) {
  width: 3px;
  height: 3px;
  left: 15%;
  animation-delay: 18s;
}
.particle:nth-child(11) {
  width: 6px;
  height: 6px;
  left: 25%;
  animation-delay: 1s;
}
.particle:nth-child(12) {
  width: 4px;
  height: 4px;
  left: 35%;
  animation-delay: 3s;
}
.particle:nth-child(13) {
  width: 5px;
  height: 5px;
  left: 65%;
  animation-delay: 7s;
}
.particle:nth-child(14) {
  width: 3px;
  height: 3px;
  left: 75%;
  animation-delay: 11s;
}
.particle:nth-child(15) {
  width: 4px;
  height: 4px;
  left: 85%;
  animation-delay: 15s;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Animations */
.animate-fade-in {
  animation: fadeInUp 1s ease forwards;
}

.animate-fade-in-delay {
  animation: fadeInUp 1s ease 0.3s forwards;
  opacity: 0;
}

.animate-fade-in-delay-2 {
  animation: fadeInUp 1s ease 0.6s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stats Section */
.stats-section {
  background: #f8f9fa;
  padding: 60px 20px;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #0a74da;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.1rem;
  color: #666;
}

/* Featured Section */
.featured {
  background: #fff;
  padding: 80px 20px;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

/* Skeleton Loading */
.skeleton-card {
  border-radius: 12px;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: pulse 1.5s ease-in-out infinite alternate;
}

.skeleton-img {
  width: 100%;
  height: 200px;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 16px;
}

.skeleton-title {
  width: 80%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0 auto 12px;
}

.skeleton-price {
  width: 40%;
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0 auto 16px;
}

.skeleton-btn {
  width: 60%;
  height: 36px;
  background: #f0f0f0;
  border-radius: 6px;
  margin: 0 auto;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

/* Enhanced Cards */
.card {
  border-radius: 12px;
  background: white;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-img-container {
  position: relative;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  transition: transform 0.3s ease;
  background: #f8f9fa;
  padding: 20px;
}

.card:hover .card-img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .card-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.card:hover .quick-view-btn {
  transform: translateY(0);
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.card-price {
  font-weight: bold;
  font-size: 1.3rem;
  color: #0a74da;
  margin-bottom: 12px;
}

.card-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  color: #ffd700;
}

.rating-text {
  font-size: 0.9rem;
  color: #666;
}

.card-link {
  display: inline-block;
  padding: 10px 20px;
  background: #0a74da;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.card-link:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Newsletter Section */
.newsletter {
  background: linear-gradient(135deg, #0a74da, #42b883);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter h3 {
  font-size: 2.2rem;
  margin-bottom: 12px;
}

.newsletter p {
  font-size: 1.1rem;
  margin-bottom: 32px;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto 20px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.newsletter-btn {
  padding: 12px 24px;
  background: white;
  color: #0a74da;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.newsletter-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.newsletter-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.subscription-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
}

.subscription-message.success {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input {
    margin-bottom: 12px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (min-width: 640px) {
  .hero-title {
    font-size: 3rem;
  }
  .hero-subtitle {
    font-size: 1.5rem;
  }
}
</style>
