<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

// Stato per gestire il flusso sequenziale
const activePlayerIndex = ref(0);
const declarationValue = ref(0); // Valore inserito nel popup per il giocatore corrente
const showModal = ref(true); // Mostra il popup all'inizio

// Trova l'indice del dealer corrente per calcolare chi deve iniziare
const dealerIndex = game.players.findIndex((p) => p.id === game.currentDealerId);

// L'ordine del gioco parte da (dealerIndex + 1), e gira in senso orario (modulo lunghezza)
const declarationOrder = computed(() => {
   const order = [];
   const totalPlayers = game.players.length;
   for (let i = 1; i <= totalPlayers; i++) {
      const idx = (dealerIndex + i) % totalPlayers;
      order.push(game.players[idx]);
   }
   return order;
});

// Giocatore che deve dichiarare in questo momento nel popup
const currentPlayer = computed(() => declarationOrder.value[activePlayerIndex.value]);

// Controlla se il giocatore corrente è il dealer (sarà l'ultimo a dichiarare)
const isCurrentPlayerDealer = computed(() => currentPlayer.value?.id === game.currentDealerId);

// Errore se il dealer inserisce la dichiarazione vietata
const isDealerInvalid = computed(() => {
   return isCurrentPlayerDealer.value && declarationValue.value === game.forbiddenDealerDeclaration;
});

// Al caricamento, mostriamo il valore già esistente (se stiamo tornando indietro) oppure 0
onMounted(() => {
   if (currentPlayer.value) {
      declarationValue.value =
         currentPlayer.value.declared !== null && currentPlayer.value.declared !== undefined
            ? currentPlayer.value.declared
            : 0;
   }
});

function nextDeclaration() {
   if (isDealerInvalid.value) return;

   // Salva la dichiarazione nel giocatore corrispondente nello store
   const playerInStore = game.players.find((p) => p.id === currentPlayer.value.id);
   if (playerInStore) {
      playerInStore.declared = declarationValue.value;
   }

   // Se non siamo all'ultimo giocatore, vai avanti
   if (activePlayerIndex.value < declarationOrder.value.length - 1) {
      activePlayerIndex.value++;
      const nextPlayer = declarationOrder.value[activePlayerIndex.value];

      // Se il giocatore successivo ha già un valore salvato, ricordatelo. Altrimenti imposta 0.
      declarationValue.value =
         nextPlayer.declared !== null && nextPlayer.declared !== undefined ? nextPlayer.declared : 0;
   } else {
      // Se tutti hanno dichiarato, chiudi il popup e vai alla schermata dei risultati del turno
      showModal.value = false;
      router.push('/turn-result');
   }
}

function prevDeclaration() {
   if (activePlayerIndex.value === 0) return;

   activePlayerIndex.value--;
   // Recuperiamo il valore che avevamo inserito precedentemente per questo giocatore
   declarationValue.value =
      currentPlayer.value.declared !== null && currentPlayer.value.declared !== undefined
         ? currentPlayer.value.declared
         : 0;
}
</script>

<template>
   <div class="py-5 px-5 position-relative">
      <h2 class="mb-3">Dichiarazioni - Turno da {{ game.currentCards }}</h2>

      <div class="row">
         <div class="col-12">
            <ScoreTable />
         </div>
      </div>

      <div v-if="showModal" class="modal-backdrop fade show"></div>
      <div v-if="showModal" class="modal d-block tab-index--1" role="dialog" style="top: 20%">
         <div class="modal-dialog" role="document">
            <div class="modal-content shadow-lg border-primary">
               <div class="modal-header bg-primary text-white">
                  <h5 class="modal-title">Fase di Dichiarazione</h5>
               </div>

               <div class="modal-content py-4 px-4 text-center">
                  <p class="fs-4 mb-1">Tocca a:</p>
                  <h3 class="fw-bold border-bottom pb-2 text-uppercase text-primary">
                     {{ currentPlayer?.name }}
                     <span v-if="isCurrentPlayerDealer" class="fs-6 text-danger d-block mt-1">(È il Dealer)</span>
                  </h3>

                  <div v-if="isCurrentPlayerDealer" class="alert alert-warning py-1 px-2 small mt-2">
                     ❌ Non puoi dichiarare <strong>{{ game.forbiddenDealerDeclaration }}</strong>
                  </div>

                  <div class="my-4 mx-auto" style="max-width: 150px">
                     <label class="form-label fw-bold">Prese dichiarate:</label>
                     <input
                        type="number"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        class="form-control form-control-lg text-center"
                        min="0"
                        :max="game.currentCards"
                        v-model.number="declarationValue"
                        :class="{ 'is-invalid': isDealerInvalid }"
                     />
                     <div v-if="isDealerInvalid" class="invalid-feedback fw-bold">Dichiarazione vietata!</div>
                  </div>

                  <div class="d-flex gap-2">
                     <button
                        v-if="activePlayerIndex > 0"
                        class="btn btn-outline-secondary btn-lg flex-grow-1"
                        @click="prevDeclaration"
                     >
                        < Indietro
                     </button>

                     <button
                        class="btn btn-success btn-lg flex-grow-1"
                        :disabled="isDealerInvalid || declarationValue < 0 || declarationValue > game.currentCards"
                        @click="nextDeclaration"
                     >
                        {{ activePlayerIndex === declarationOrder.length - 1 ? 'Termina e Gioca' : 'Avanti >' }}
                     </button>
                  </div>

                  <small class="text-muted d-block mt-3">
                     Giocatore {{ activePlayerIndex + 1 }} di {{ declarationOrder.length }}
                  </small>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
.modal-backdrop {
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 1040;
}
.modal {
   z-index: 1050;
}
</style>
