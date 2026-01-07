<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

// Somma delle prese effettive dichiarate/sbagliate
const totalTaken = computed(() => {
   return game.players.reduce((sum, p) => sum + (p.taken ?? 0), 0);
});

// Controllo se tutti i giocatori hanno deciso giusto/sbagliato
const allSet = computed(() => game.players.every((p) => p.resultCorrect !== null));

function endTurn() {
   game.closeTurn();
   if (game.isGameFinished) {
      router.push('/result');
   } else {
      router.push('/turn');
   }
}
</script>

<template>
   <div class="p-5">
      <h2 class="mb-3">Risultato turno da {{ game.currentCards }}</h2>

      <div class="row d-flex justify-content-between">
         <div class="col-9">
            <ScoreTable />
         </div>

         <div class="col-2 border border-secondary-subtle py-3">
            <h3 class="mb-4">Dichiarazioni</h3>
            <div class="mt-4" v-for="player in game.players" :key="player.id">
               <div class="card mb-3">
                  <div class="card-body">
                     <div class="d-flex justify-content-between">
                        <h5 class="card-title">
                           <strong>{{ player.name }}</strong> -
                           <span class="text-primary">({{ player.declared }})</span>
                        </h5>

                        <div class="mb-2">
                           <button class="btn btn-success me-2" @click="game.setResult(player.id, true)">✔</button>
                           <button class="btn btn-danger" @click="game.setResult(player.id, false)">✖</button>
                        </div>
                     </div>

                     <!-- SOLO SE SBAGLIATO -->
                     <div v-if="player.resultCorrect === false" class="mb-2">
                        <label class="form-label">
                           Prese fatte:
                           <input
                              class="form-control"
                              type="number"
                              min="0"
                              :max="game.currentCards"
                              v-model.number="player.taken"
                           />
                        </label>
                     </div>

                     <!-- FEEDBACK -->
                     <p v-if="player.resultCorrect === true" class="text-success fw-bold">✅ Presa giusta</p>
                     <p v-if="player.resultCorrect === false" class="text-danger fw-bold">❌ Presa sbagliata</p>
                  </div>
               </div>

               <!-- <strong>{{ player.name }}</strong> -->
            </div>
            <button
               class="btn btn-primary mt-3"
               @click="endTurn"
               :disabled="!allSet || totalTaken !== game.currentCards"
            >
               Termina turno
            </button>
            <p v-if="totalTaken !== game.currentCards && allSet" class="alert alert-danger mt-3">
               ⚠ La somma delle prese deve essere: {{ game.currentCards }}
            </p>
         </div>
      </div>
   </div>
</template>
