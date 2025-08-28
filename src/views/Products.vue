<template>
  <section>
    <h2>Products</h2>
    <div style="margin-bottom: 16px; display: flex; gap: 12px">
      <input
        v-model="search"
        placeholder="Search product..."
        style="flex: 1; padding: 8px"
      />
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.name">
          {{ c.name }}
        </option>
      </select>
      <select v-model="priceRange">
        <option value="">All Prices</option>
        <option value="0-50">Rp. 0 - 800.000</option>
        <option value="50-100">Rp. 810.000 - 1.600.000</option>
        <option value="100-200">Rp. 1.600.000 - 3.200.000</option>
      </select>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="products-grid">
        <div v-for="n in 6" :key="n" class="product-card skeleton">
          <div class="skeleton-img"></div>
          <div class="product-body">
            <div class="skeleton-text short"></div>
            <div class="skeleton-text"></div>
            <div class="product-footer">
              <div class="skeleton-text price"></div>
              <div class="skeleton-btn"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else key="products" class="products-grid">
        <div v-if="filteredProducts.length === 0">No products found.</div>
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="$router.push(`/products/${product.id}`)"
        >
          <img
            :src="product.images?.[0]"
            alt="Product Image"
            class="product-img"
          />
          <div class="product-body">
            <h3 class="product-title">{{ product.title }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <span class="price">Rp.{{ formatPrice(product.price) }}</span>
              <button class="btn" @click="addToCart" :disabled="isAdding">
                <span v-if="isAdding">Adding to cart...</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchProducts } from "../api/products";
import { useCartStore } from "../store/cart";

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const isAdding = ref(false);
const search = ref("");
const selectedCategory = ref("");
const priceRange = ref("");

const cart = useCartStore();

onMounted(async () => {
  try {
    products.value = await fetchProducts();
    const unique = [];
    products.value.forEach((p) => {
      if (p.category && !unique.find((c) => c.id === p.category.id)) {
        unique.push(p.category);
      }
    });
    categories.value = unique;
  } catch (e) {
    console.error(e);
    alert("Gagal memuat produk");
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 800);
  }
});
async function addToCart() {
  isAdding.value = true;
  await new Promise((r) => setTimeout(r, 800));
  animateToCart();
  cart.addToCart(product.value, quantity.value);
  isAdding.value = false;
  showToast("✅Successfully added to cart!");
}

function formatPrice(v) {
  const rate = 16000;
  return (v * rate).toLocaleString("id-ID");
}

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.title
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchCategory =
      !selectedCategory.value || p.category?.name === selectedCategory.value;

    let matchPrice = true;
    if (priceRange.value) {
      const [min, max] = priceRange.value.split("-").map(Number);
      matchPrice = p.price >= min && p.price <= max;
    }

    return matchSearch && matchCategory && matchPrice;
  });
});
</script>
