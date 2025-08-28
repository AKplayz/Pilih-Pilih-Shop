<template>
  <div class="skeleton-card">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-desc"></div>
    <div class="skeleton skeleton-price"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-image {
  width: 100%;
  height: 150px;
}

.skeleton-title {
  width: 70%;
  height: 16px;
}

.skeleton-desc {
  width: 90%;
  height: 12px;
}

.skeleton-price {
  width: 40%;
  height: 14px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
