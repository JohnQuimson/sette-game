<script setup>
import FooterComponent from '@/components/FooterComponent.vue';
</script>

<template>
   <div class="layout">
      <router-view />
      <FooterComponent />
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
