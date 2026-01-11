<script setup>
import Footer from '@/components/Footer.vue';
</script>

<template>
  <div class="layout">
    <router-view />
    <Footer />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0px;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
