<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';
import ScoreTable from '@/components/ScoreTable.vue';

const router = useRouter();
const game = useGameStore();

// Stato per il flusso sequenziale del popup
const activePlayerIndex = ref(0);
const showModal = ref(true);

// Trova l'indice del dealer corrente per seguire lo stesso ordine orario delle dichiarazioni
const dealerIndex = computed(() => {
  if (!game.players || game.players.length === 0) return 0;
  return game.players.findIndex((p) => p.id === game.currentDealerId);
});

const playOrder = computed(() => {
  const order = [];
  if (!game.players || game.players.length === 0) return order;

  const totalPlayers = game.players.length;
  for (let i = 1; i <= totalPlayers; i++) {
    const idx = (dealerIndex.value + i) % totalPlayers;
    if (game.players[idx]) {
      order.push(game.players[idx]);
    }
  }
  return order;
});

// Giocatore corrente nel popup con controllo di sicurezza
const currentPlayer = computed(() => {
  if (!playOrder.value || playOrder.value.length === 0) return null;
  return playOrder.value[activePlayerIndex.value] || null;
});

// Somma di tutte le prese assegnate fino ad ora (con controllo anti-undefined)
const totalTaken = computed(() => {
  if (!game.players) return 0;
  return game.players.reduce((sum, p) => sum + (p?.taken ?? 0), 0);
});

// Controlla se tutti i giocatori hanno un risultato impostato
const allSet = computed(() => {
  if (!game.players || game.players.length === 0) return false;
  return game.players.every(
    (p) => p?.resultCorrect !== null && p?.resultCorrect !== undefined,
  );
});

// Al caricamento, resettiamo solo i risultati e le prese effettive
onMounted(() => {
  if (game.players) {
    game.players.forEach((p) => {
      p.resultCorrect = null;
      p.taken = null;
    });
  }
});

// Funzione quando si clicca "✔ Presa Giusta"
function setCorrect() {
  if (!currentPlayer.value) return;
  const player = game.players.find((p) => p.id === currentPlayer.value.id);
  if (player) {
    player.resultCorrect = true;
    player.taken = player.declared;
  }
  nextStep();
}

// Funzione quando si clicca "✖ Presa Sbagliata"
function setWrong() {
  if (!currentPlayer.value) return;
  const player = game.players.find((p) => p.id === currentPlayer.value.id);
  if (player) {
    player.resultCorrect = false;
    if (player.taken === null || player.taken === player.declared) {
      player.taken = 0;
    }
  }
}

function confirmWrongAndNext() {
  nextStep();
}

function nextStep() {
  if (activePlayerIndex.value < playOrder.value.length - 1) {
    activePlayerIndex.value++;
  } else {
    showModal.value = false;
  }
}

function prevStep() {
  if (activePlayerIndex.value > 0) {
    activePlayerIndex.value--;
    showModal.value = true;
  }
}

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
  <div class="p-5 position-relative">
    <h2 class="mb-3">Risultato turno da {{ game.currentCards }}</h2>

    <div class="row d-flex justify-content-between">
      <div class="col-12 col-md-9">
        <ScoreTable />
      </div>

      <div
        class="col-12 col-md-3 border border-secondary-subtle py-3 px-3 bg-light rounded mt-3 mt-md-0"
      >
        <h3 class="mb-3 fs-4">Riepilogo Prese</h3>
        <ul class="list-group mb-3">
          <li
            v-for="player in game.players"
            :key="player.id"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ player?.name }}</strong>
              <small class="text-muted d-block"
                >Dichiarate: {{ player?.declared }}</small
              >
            </div>
            <span
              :class="
                player?.resultCorrect ? 'badge bg-success' : 'badge bg-danger'
              "
            >
              Fatte: {{ player?.taken ?? 0 }}
            </span>
          </li>
        </ul>

        <div
          class="alert text-center py-2"
          :class="
            totalTaken === game.currentCards ? 'alert-success' : 'alert-danger'
          "
        >
          Totale prese: <strong>{{ totalTaken }}</strong> /
          {{ game.currentCards }}
        </div>

        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-secondary w-50"
            @click="showModal = true"
          >
            ✏️ Modifica
          </button>
          <button
            class="btn btn-primary w-50"
            @click="endTurn"
            :disabled="!allSet || totalTaken !== game.currentCards"
          >
            Fine Turno
          </button>
        </div>

        <p
          v-if="totalTaken !== game.currentCards && allSet"
          class="text-danger small fw-bold text-center mt-2 mb-0"
        >
          ⚠ La somma deve fare {{ game.currentCards }}!
        </p>
      </div>
    </div>

    <div
      v-if="showModal && currentPlayer"
      class="modal-backdrop fade show"
    ></div>
    <div
      v-if="showModal && currentPlayer"
      class="modal d-block tab-index--1"
      role="dialog"
      style="top: 15%"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content shadow-lg border-success">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Assegnazione Prese Effettive</h5>
          </div>

          <div class="modal-content py-4 px-4 text-center">
            <p class="fs-5 mb-1">Turno di:</p>
            <h2 class="fw-bold text-uppercase text-success mb-2">
              {{ currentPlayer?.name }}
            </h2>
            <p class="fs-5 text-muted">
              Ha dichiarato:
              <strong class="text-primary">{{
                currentPlayer?.declared
              }}</strong>
            </p>

            <hr />

            <div
              v-if="currentPlayer?.resultCorrect === null"
              class="d-flex gap-3 justify-content-center my-4"
            >
              <button class="btn btn-danger btn-lg px-4" @click="setWrong">
                Sbagliato
              </button>
              <button class="btn btn-success btn-lg px-4" @click="setCorrect">
                Giusto ({{ currentPlayer?.declared }})
              </button>
            </div>

            <div
              v-else-if="currentPlayer?.resultCorrect === false"
              class="my-4 mx-auto"
              style="max-width: 200px"
            >
              <label class="form-label fw-bold text-danger">Prese fatte:</label>
              <input
                type="text"
                readonly
                class="form-control form-control-lg text-center"
                :value="currentPlayer.taken ?? ''"
              />
              <div class="number-pad mt-3">
                <button
                  v-for="n in game.currentCards + 1"
                  :key="n - 1"
                  class="btn btn-outline-primary"
                  @click="currentPlayer.taken = n - 1"
                >
                  {{ n - 1 }}
                </button>

                <button
                  class="btn btn-outline-danger"
                  @click="currentPlayer.taken = null"
                >
                  ⌫
                </button>
              </div>
              <button
                class="btn btn-success mt-3 w-100"
                :disabled="
                  currentPlayer.taken === currentPlayer.declared ||
                  currentPlayer.taken < 0 ||
                  currentPlayer.taken > game.currentCards
                "
                @click="confirmWrongAndNext"
              >
                Conferma prese
              </button>
              <button
                class="btn btn-outline-primary mt-2 w-100"
                @click="setCorrect"
              >
                In realtà era Giusto
              </button>
              <small
                v-if="currentPlayer.taken === currentPlayer.declared"
                class="text-danger d-block mt-1"
              >
                Non puoi aver fatto {{ currentPlayer.declared }} prese
              </small>
            </div>

            <div v-else class="my-4 text-success fw-bold fs-4">
              Corretto
              <button
                class="btn btn-sm btn-outline-secondary d-block mx-auto mt-2"
                @click="currentPlayer.resultCorrect = null"
              >
                Cambia scelta
              </button>
            </div>

            <div class="d-flex justify-content-between border-top pt-3 mt-3">
              <button
                class="btn btn-sm btn-secondary"
                :disabled="activePlayerIndex === 0"
                @click="prevStep"
              >
                < Prec.
              </button>

              <span class="text-muted align-self-center small">
                Giocatore {{ activePlayerIndex + 1 }} di {{ playOrder.length }}
              </span>

              <button
                class="btn btn-sm btn-dark"
                :disabled="
                  currentPlayer?.resultCorrect === null ||
                  (currentPlayer?.resultCorrect === false &&
                    currentPlayer?.taken === currentPlayer?.declared)
                "
                @click="nextStep"
              >
                {{
                  activePlayerIndex === playOrder.length - 1
                    ? 'Vedi Riepilogo 🏁'
                    : 'Prossimo >'
                }}
              </button>
            </div>

            <div class="border-top pt-3 mt-3">
              <button
                class="btn btn-outline-danger btn-sm w-100"
                @click="router.push('/declarations')"
              >
                ↩️ Qualcuno ha sbagliato a dichiarare? Torna indietro
              </button>
            </div>
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

.number-pad {
  display: grid;
  grid-template-columns: repeat(3, 50px);
  gap: 8px;
  justify-content: center;
}

.number-pad button {
  height: 45px;
  font-size: 1.2rem;
}

@media (max-width: 576px) {
  .number-pad {
    grid-template-columns: repeat(3, 60px);
  }

  .number-pad button {
    height: 55px;
  }
}
</style>
