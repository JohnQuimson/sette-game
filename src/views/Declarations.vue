<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

// dealer corrente
const dealer = computed(() => game.players.find((p) => p.id === game.currentDealerId));

// dealer ha inserito la dichiarazione vietata?
const dealerInvalidDeclaration = computed(() => {
   if (!dealer.value) return false;
   return dealer.value.declared === game.forbiddenDealerDeclaration;
});

function finishDeclarations() {
   if (dealerInvalidDeclaration.value) return;
   router.push('/turn-result');
}
</script>

<template>
   <div class="py-5 px-5">
      <h2 class="mb-3">Dichiarazioni - Turno da {{ game.currentCards }}</h2>

      <div class="row d-flex justify-content-between">
         <div class="col-9">
            <ScoreTable />
         </div>

         <div class="col-2 border border-secondary-subtle py-3">
            <h3 class="mb-4">Dichiarazioni</h3>

            <div v-for="player in game.players" :key="player.id" class="mb-3">
               <label class="form-label fw-bold">
                  {{ player.name }}
                  <span v-if="player.id === game.currentDealerId">(Dealer)</span>
               </label>

               <small v-if="player.id === game.currentDealerId" class="d-block text-danger mb-1">
                  ❌ Non può dichiarare {{ game.forbiddenDealerDeclaration }}
               </small>

               <input
                  type="number"
                  class="form-control w-50"
                  min="0"
                  :max="game.currentCards"
                  v-model.number="player.declared"
                  :class="{
                     'is-invalid': player.id === game.currentDealerId && dealerInvalidDeclaration,
                  }"
               />

               <div
                  v-if="player.id === game.currentDealerId && dealerInvalidDeclaration"
                  class="invalid-feedback d-block"
               >
                  Dichiarazione non valida per il dealer
               </div>
            </div>

            <button class="btn btn-success mt-3 w-100" :disabled="dealerInvalidDeclaration" @click="finishDeclarations">
               Termina dichiarazioni
            </button>
         </div>
      </div>
   </div>
</template>
