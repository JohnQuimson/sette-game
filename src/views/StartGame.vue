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
  <div class="container py-5 text-center">
    <h1 class="mb-4">Benvenuto in Sette!</h1>

    <label class="form-label">Numero giocatori</label>
    <input
      type="number"
      class="form-control w-25 mx-auto mb-3 text-center"
      min="4"
      max="7"
      v-model="playersCount"
    />

    <button class="btn btn-primary" @click="start">Gioca</button>

    <div v-if="game.cardsToRemove.length" class="mt-5">
      <h4>Carte da togliere</h4>
      <p>{{ game.cardsToRemove.join(', ') }}</p>
    </div>
  </div>
</template>
