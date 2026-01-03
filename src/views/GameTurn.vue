<template>
  <div class="container py-5">
    <h2 class="mb-3">Turno {{ game.currentTurnNumber }}</h2>

    <div class="mb-3">
      <p>
        Carte per giocatore: <strong>{{ game.currentCards }}</strong>
      </p>
      <p>
        Dealer: <strong>{{ game.currentDealerName }}</strong>
      </p>
    </div>

    <ScoreTable />

    <button class="btn btn-primary mt-3" @click="goDeclarations">
      Vai alle dichiarazioni
    </button>
  </div>
</template>

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
