<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';

const router = useRouter();
const game = useGameStore();

const playersCount = ref(4);

function start() {
  game.setPlayersCount(playersCount.value);
  game.calculateCardsToRemove();
  router.push('/players');
}
</script>

<template>
  <h1>Sette</h1>

  <label>Numero giocatori</label>
  <input type="number" min="3" max="8" v-model="playersCount" />

  <button @click="start">Gioca</button>

  <div v-if="game.cardsToRemove.length">
    <h3>Carte da togliere</h3>
    <p>{{ game.cardsToRemove.join(', ') }}</p>
  </div>
</template>
