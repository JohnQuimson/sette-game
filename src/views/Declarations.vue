<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

function finishDeclarations() {
  router.push('/turn-result');
}
</script>

<template>
  <h2>Dichiarazioni</h2>

  <ScoreTable />

  <div v-for="player in game.players" :key="player.id">
    <label>
      {{ player.name }}
      <span v-if="player.id === game.currentDealerId">(dealer)</span>
    </label>

    <input
      type="number"
      min="0"
      :max="game.currentCards"
      v-model.number="player.declared"
    />

    <small v-if="player.id === game.currentDealerId">
      ❌ Non può dichiarare {{ game.forbiddenDealerDeclaration }}
    </small>
  </div>

  <button @click="finishDeclarations">Termina dichiarazioni</button>
</template>
