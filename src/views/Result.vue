<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore.js';
import { useRouter } from 'vue-router';

const game = useGameStore();
const router = useRouter();

// Ordiniamo i giocatori dal punteggio più alto a quello più basso per la classifica.
// Facciamo una copia dell'array con [...array] per evitare di mutare l'array originale dello store.
const sortedRanking = computed(() => {
   return [...game.players].sort((a, b) => b.points - a.points);
});

function restartGame() {
   // Se hai una funzione di reset nello store, chiamala qui. Esempio: game.resetGame();
   router.push('/');
}
</script>

<template>
   <div class="container py-5 text-center" style="max-width: 600px">
      <div class="card shadow-lg p-4 border-0 bg-light">
         <h1 class="display-4 text-success mb-4">🏆 Classifica Finale 🏆</h1>

         <div class="table-responsive my-4">
            <table class="table table-hover table-striped align-middle fs-4">
               <thead class="table-dark">
                  <tr>
                     <th scope="col" style="width: 20%">Pos</th>
                     <th scope="col">Giocatore</th>
                     <th scope="col" style="width: 30%">Punti</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="(p, index) in sortedRanking" :key="p.id" :class="{ 'table-success fw-bold': index === 0 }">
                     <td>
                        <span v-if="index === 0">🥇</span>
                        <span v-else-if="index === 1">🥈</span>
                        <span v-else-if="index === 2">🥉</span>
                        <span v-else>{{ index + 1 }}°</span>
                     </td>
                     <td>{{ p.name }}</td>
                     <td>
                        <span class="badge bg-primary rounded-pill px-3">{{ p.points }} pt</span>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

         <div class="mt-4">
            <button class="btn btn-primary btn-lg px-5" @click="restartGame">🔄 Nuova Partita</button>
         </div>
      </div>
   </div>
</template>
