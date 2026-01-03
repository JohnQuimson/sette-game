<template>
  <div class="container py-5">
    <h2 class="mb-3">Dichiarazioni turno {{ game.currentTurnNumber }}</h2>

    <ScoreTable />

    <div class="mt-4" v-for="player in game.players" :key="player.id">
      <label class="form-label fw-bold">
        {{ player.name }}
        <span v-if="player.id === game.currentDealerId">(dealer)</span>
      </label>

      <input
        type="number"
        class="form-control w-25 mb-2"
        min="0"
        :max="game.currentCards"
        v-model.number="player.declared"
      />

      <small v-if="player.id === game.currentDealerId" class="text-danger">
        ❌ Non può dichiarare {{ game.forbiddenDealerDeclaration }}
      </small>
    </div>

    <button class="btn btn-success mt-3" @click="finishDeclarations">
      Termina dichiarazioni
    </button>
  </div>
</template>

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
