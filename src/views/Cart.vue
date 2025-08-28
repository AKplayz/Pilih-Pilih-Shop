<template>
  <section class="cart-container">
    <h2 class="title">Your Cart</h2>

    <div v-if="!items.length" class="empty">
      <img src="/empty-cart.svg" alt="Empty cart" class="empty-img" />
      <p>Your cart is empty</p>
      <router-link to="/products" class="btn">Shop Now</router-link>
    </div>

    <div v-else class="cart-grid">
      <div class="cart-list">
        <transition-group name="cart-item" tag="div">
          <div
            v-for="it in items"
            :key="it.id"
            class="cart-item"
            :class="{ removing: removingItems.has(it.id) }"
          >
            <img :src="it.image" alt="" class="cart-img" />
            <div class="cart-info">
              <h3>{{ it.title }}</h3>
              <p class="price">Rp {{ formatPrice(it.price) }}</p>

              <div class="quantity">
                <button @click="dec(it)" :disabled="it.quantity <= 1">-</button>
                <span>{{ it.quantity }}</span>
                <button @click="inc(it)">+</button>
              </div>
            </div>

            <div class="cart-actions">
              <div class="subtotal">
                Rp {{ formatPrice(it.price * it.quantity) }}
              </div>
              <button
                class="remove"
                @click="remove(it.id)"
                :disabled="removingItems.has(it.id)"
              >
                <span v-if="!removingItems.has(it.id)">Remove</span>
                <div v-else class="loading-spinner"></div>
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="summary">
        <h3>Order Summary</h3>
        <div class="row">
          <span>Items ({{ totalItems }})</span>
          <span>Rp {{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="row">
          <span>Shipping</span>
          <span>Rp {{ formatPrice(20000 / rate) }}</span>
        </div>
        <div class="row total">
          <span>Total</span>
          <strong>Rp {{ formatPrice(totalPrice + 20000 / rate) }}</strong>
        </div>
        <button
          @click="proceedToCheckout"
          class="btn full checkout-btn"
          :disabled="isCheckingOut"
          :class="{ loading: isCheckingOut }"
        >
          <span v-if="!isCheckingOut">Proceed to Checkout</span>
          <div v-else class="checkout-loading">
            <div class="loading-spinner"></div>
            <span>Processing...</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store/cart";
import { storeToRefs } from "pinia";

const router = useRouter();
const cart = useCartStore();
const { items, totalItems, totalPrice } = storeToRefs(cart);

const rate = 16000;
const removingItems = ref(new Set());
const isCheckingOut = ref(false);

function formatPrice(v) {
  return (v * rate).toLocaleString("id-ID");
}

async function remove(id) {
  removingItems.value.add(id);

  // Simulate loading delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  cart.removeFromCart(id);
  removingItems.value.delete(id);
}

function updateQty(id, qty) {
  cart.updateQuantity(id, qty);
}

function inc(it) {
  updateQty(it.id, it.quantity + 1);
}

function dec(it) {
  updateQty(it.id, it.quantity - 1);
}

async function proceedToCheckout() {
  isCheckingOut.value = true;

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Navigate to checkout
  router.push("/checkout");
  isCheckingOut.value = false;
}
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.cart-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
  align-items: center;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.cart-item.removing {
  opacity: 0.6;
  transform: scale(0.98);
  pointer-events: none;
}

.cart-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-info {
  flex: 1;
}

.price {
  font-size: 14px;
  color: #777;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.quantity button {
  padding: 4px 10px;
  border: 1px solid #ddd;
  background: #f8f8f8;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.quantity button:hover:not(:disabled) {
  background: #e8e8e8;
  transform: scale(1.05);
}

.quantity button:active {
  transform: scale(0.95);
}

.cart-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.subtotal {
  font-weight: bold;
}

.remove {
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  min-width: 60px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove:hover:not(:disabled) {
  background: rgba(255, 0, 0, 0.1);
  transform: scale(1.05);
}

.remove:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.summary {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 12px;
  background: white;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.summary h3 {
  margin-bottom: 16px;
}

.summary .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary .total {
  border-top: 1px solid #ddd;
  padding-top: 8px;
  margin-top: 8px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  background: black;
  color: white;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

.btn:hover:not(:disabled) {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn.full {
  width: 100%;
  text-align: center;
}

.checkout-btn {
  position: relative;
  overflow: hidden;
  min-height: 44px;
}

.checkout-btn.loading {
  background: #666;
  cursor: not-allowed;
}

.checkout-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty {
  text-align: center;
  padding: 40px 0;
}

.empty-img {
  width: 200px;
  margin-bottom: 16px;
}

/* Transition animations for cart items */
.cart-item-enter-active {
  transition: all 0.4s ease;
}

.cart-item-leave-active {
  transition: all 0.4s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.cart-item-move {
  transition: transform 0.4s ease;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
