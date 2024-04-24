<script setup lang="ts">
import SpreadBox from '../components/SpreadBox.vue'
</script>

<template>
  <main>
    <div class="grid">
      <SpreadBox
        exchange="Binance"
        symbol="BTC/USD"
        url="http://localhost:3000"
      />
    </div>
  </main>
</template>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
}
.grid > * {
  margin: auto;
  margin-bottom: 0.75rem;
  min-width: 350px;
}
</style>
