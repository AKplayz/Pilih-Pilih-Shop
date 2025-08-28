<template>
  <section class="checkout container">
    <h2 class="title">Checkout</h2>

    <div v-if="!items.length" class="card empty">
      <p>No items to checkout.</p>
    </div>

    <div v-else class="checkout-grid">
      <div class="card form-section">
        <h3>Billing Details</h3>
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="form.name" type="text" placeholder="Your name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@mail.com"
          />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input v-model="form.phone" type="tel" placeholder="+62" />
        </div>
        <div class="form-group">
          <label>Address</label>
          <textarea
            v-model="form.address"
            placeholder="Street, City, Province"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Payment Method</label>
          <select v-model="form.payment">
            <option disabled value="">-- Select --</option>
            <option>Bank Transfer</option>
            <option>COD</option>
            <option>Gopay</option>
            <option>OVO</option>
          </select>
        </div>
      </div>

      <div class="card summary-section">
        <h3>Order Summary</h3>
        <ul class="order-list">
          <li v-for="item in items" :key="item.id" class="order-item">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span
              >Rp
              {{
                formatPrice(item.price * item.quantity).toLocaleString("id-ID")
              }}</span
            >
          </li>
        </ul>
        <hr />
        <div class="flex-between">
          <span>Subtotal</span>
          <strong
            >Rp {{ formatPrice(totalPrice.toLocaleString("id-ID")) }}</strong
          >
        </div>
        <div class="flex-between">
          <span>Shipping</span>

          <strong>Rp 0</strong>
        </div>
        <div class="flex-between total">
          <span>Total</span>
          <strong
            >Rp {{ formatPrice(totalPrice.toLocaleString("id-ID")) }}</strong
          >
        </div>

        <button class="btn-primary" :disabled="loading" @click="placeOrder">
          <span v-if="loading">Processing...</span>
          <span v-else>Place Order</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useCartStore } from "../store/cart";
import { useRouter } from "vue-router";

const cart = useCartStore();
const router = useRouter();
const { items, totalPrice, clearCart } = cart;

const form = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  payment: "",
});
const loading = ref(false);

function placeOrder() {
  if (!form.name || !form.address || !form.payment) {
    alert("Please complete the required fields");
    return;
  }

  loading.value = true;
  setTimeout(() => {
    alert(
      `🎉 Order placed successfully!\nTotal: Rp ${totalPrice.toLocaleString(
        "id-ID"
      )}`
    );
    clearCart();
    router.push("/");
    loading.value = false;
  }, 1500);
}
function formatPrice(v) {
  const rate = 16000;
  return (v * rate).toLocaleString("id-ID");
}
</script>

<style scoped>
.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
.card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
}
.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.order-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}
.total {
  font-size: 1.1rem;
  margin-top: 10px;
}
.btn-primary {
  width: 100%;
  padding: 12px;
  background: #2d6cdf;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 16px;
}
.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}
</style>
