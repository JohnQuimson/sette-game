<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

function goDeclarations() {
  router.push('/declarations');
}
</script>

<template>
  <h2>Turno {{ game.currentTurnNumber }}</h2>

  <p>Carte per giocatore: {{ game.currentCards }}</p>
  <p>
    Dealer: <strong>{{ game.currentDealerName }}</strong>
  </p>

  <ScoreTable />

  <button @click="goDeclarations">Vai alle dichiarazioni</button>
</template>
