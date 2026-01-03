<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';

const router = useRouter();
const game = useGameStore();

const names = ref(Array(game.playersCount).fill(''));
const extracting = ref(false);

function extractDealer() {
  extracting.value = true;
  setTimeout(() => {
    game.setPlayers(names.value);
    game.extractFirstDealer();
    extracting.value = false;
  }, 1200);
}

function startGame() {
  game.startGame();
  router.push('/turn');
}
</script>

<template>
  <h2>Inserisci i giocatori</h2>

  <!-- 🃏 CARTE DA TOGLIERE -->
  <div v-if="game.cardsToRemove.length" style="margin-bottom: 16px">
    <h3>Carte da togliere dal mazzo</h3>
    <p>
      {{ game.cardsToRemove.join(', ') }}
    </p>
  </div>

  <!-- 👥 NOMI -->
  <div v-for="(n, i) in names" :key="i">
    <input v-model="names[i]" placeholder="Nome giocatore" />
  </div>

  <button @click="extractDealer">Estrai dealer</button>

  <p v-if="extracting">🎲 Estrazione in corso...</p>

  <p v-if="game.firstDealerName">
    Dealer estratto: <strong>{{ game.firstDealerName }}</strong>
  </p>

  <button :disabled="!game.firstDealerName" @click="startGame">
    Inizia a giocare
  </button>
</template>
