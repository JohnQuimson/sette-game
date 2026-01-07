<template>
   <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
         <h2 class="mb-3">{{ game.currentCards }} Carte - {{ game.currentDealerName }}</h2>
         <button class="btn btn-success" @click="goDeclarations">Vai alle dichiarazioni</button>
      </div>

      <ScoreTable />
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
