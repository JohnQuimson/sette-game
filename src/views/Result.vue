<script setup>
import { useGameStore } from '@/stores/gameStore.js';
const game = useGameStore();
</script>

<template>
  <h1>Classifica finale</h1>

  <ol>
    <li v-for="p in game.ranking" :key="p.id">
      {{ p.name }} — {{ p.points }} punti
    </li>
  </ol>
</template>
