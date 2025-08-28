<template>
  <section v-if="loading">Loading...</section>
  <section v-else class="container">
    <div class="detail-grid">
      <div class="gallery">
        <img 
          :src="activeImage" 
          alt="product" 
          class="main-image" 
        />
        <div class="thumbnails">
          <img 
            v-for="(img, i) in product.images" 
            :key="i" 
            :src="img" 
            class="thumb" 
            :class="{ active: img === activeImage }"
            @click="activeImage = img"
          />
        </div>
      </div>
      <div class="info">
        <h2>{{ product.title }}</h2>
        <span class="badge">{{ product.category?.name }}</span>
        <p class="small">{{ product.description }}</p>
        <p>⭐ 4.5 / 5 (23 reviews)</p>
        <p class="price">Rp {{ formatPrice(product.price) }}</p>
        <p class="stock">Availability: <strong>In Stock</strong></p>
        <div class="quantity">
          <button @click="dec">-</button>
          <span>{{ quantity }}</span>
          <button @click="inc">+</button>
        </div>
       <div class="actions">
  <button class="btn" @click="addToCart" :disabled="isAdding">
    <span v-if="isAdding">Adding to cart...</span>
    <span v-else>Add to Cart</span>
  </button>
  <button class="btn-outline" @click="buyNow" :disabled="isBuying">
    <span v-if="isBuying">Processing Order...</span>
    <span v-else>Buy Now</span>
  </button>
</div>
<div v-if="toast.show" class="toast" :class="toast.type">
  {{ toast.message }}
</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProductById } from '../api/products';
import { useCartStore } from '../store/cart';
const route = useRoute();
const router = useRouter();
const product = ref({});
const loading = ref(true);
const cart = useCartStore();
const activeImage = ref('');
const quantity = ref(1);
const isAdding = ref(false);
const isBuying = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });
onMounted(async () => {
  try {
    const id = route.params.id;
    product.value = await fetchProductById(id);
    activeImage.value = product.value.images?.[0];
  } catch (e) {
    console.error(e);
    alert('Gagal memuat detail produk');
  } finally {
    loading.value = false;
  }
});
function animateToCart() {
  const productImg = document.querySelector(".main-image"); 
  const cartIcon = document.querySelector(".cart-icon");   

  if (!productImg || !cartIcon) return;

  const imgRect = productImg.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const clone = productImg.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";
  clone.style.transition = "all 0.8s cubic-bezier(.4,-0.3,.6,1.4)";
  clone.style.zIndex = 9999;

  document.body.appendChild(clone);

  void clone.offsetWidth;

  clone.style.left = cartRect.left + "px";
  clone.style.top = cartRect.top + "px";
  clone.style.width = "40px";
  clone.style.height = "40px";
  clone.style.opacity = "0.5";

  clone.addEventListener("transitionend", () => {
    clone.remove();
  });
}


async function addToCart() {
  isAdding.value = true;
  await new Promise(r => setTimeout(r, 800)); 
   animateToCart();
  cart.addToCart(product.value, quantity.value);
  isAdding.value = false;
  showToast('✅Successfully added to cart!');
}

async function buyNow() {
  isBuying.value = true;
  await new Promise(r => setTimeout(r, 800)); 
  cart.addToCart(product.value, 1); 
  isBuying.value = false;
  router.push('/cart'); 
}

function formatPrice(v) {
  const rate = 16000;
  return (v * rate).toLocaleString('id-ID');
}

function inc() {
  quantity.value++;
}
function dec() {
  if (quantity.value > 1) quantity.value--;
}

function showToast(msg, type = 'success') {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 2000);
}

</script>



<style scoped>
.btn, .btn-outline {
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn {
  background: #333;
  color: white;
  border: none;
}
.btn:disabled {
  background: #888;
  cursor: not-allowed;
}
.btn-outline {
  border: 1px solid #333;
  background: white;
}
.btn-outline:disabled {
  border-color: #aaa;
  color: #aaa;
  cursor: not-allowed;
}
/* Toast notification */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #333;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0.95;
  animation: fadeInOut 2s forwards;
}
.toast.success {
  background: #22c55e; 
}
.toast.error {
  background: #ef4444;
}
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: flex-start;
}
.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
}
.thumbnails {
  display: flex;
  gap: 8px;
}
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  border: 2px solid transparent;
}
.thumb.active {
  opacity: 1;
  border-color: #333;
}
.info .badge {
  display: inline-block;
  margin: 8px 0;
  padding: 4px 8px;
  background: #eee;
  border-radius: 6px;
  font-size: 12px;
}
.price {
  font-size: 20px;
  font-weight: bold;
  margin: 12px 0;
}
.quantity {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 16px 0;
}
.quantity button {
  padding: 4px 12px;
  border: 1px solid #ddd;
  cursor: pointer;
}
.actions {
  display: flex;
  gap: 12px;
}
.btn-outline {
  padding: 8px 16px;
  border: 1px solid #333;
  background: white;
  cursor: pointer;
  border-radius: 8px;
}
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
