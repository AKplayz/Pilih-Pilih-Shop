import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'));

  function addToCart(product, qty = 1) {
    const p = items.value.find(i => i.id === product.id);
    if (p) {
      p.quantity += qty;
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: qty
      });
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(i => i.id !== productId);
  }

  function updateQuantity(productId, qty) {
    const p = items.value.find(i => i.id === productId);
    if (p) p.quantity = Math.max(1, qty);
  }

  function clearCart() {
    items.value = [];
  }

  const totalItems = computed(() => items.value.reduce((s, i) => s + i.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0));

  watch(items, (val) => {
    localStorage.setItem('cart', JSON.stringify(val));
  }, { deep: true });

  return {
    items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice
  };
});
