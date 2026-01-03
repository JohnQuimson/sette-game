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
const allSet = computed(() =>
  game.players.every((p) => p.resultCorrect !== null)
);

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
  <div class="container py-5">
    <h2>Risultato turno {{ game.currentTurnNumber }}</h2>
    <ScoreTable />

    <div class="mt-4" v-for="player in game.players" :key="player.id">
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ player.name }}</h5>
          <p>
            Dichiarate: <strong>{{ player.declared }}</strong>
          </p>
          <div class="mb-2">
            <button
              class="btn btn-success me-2"
              @click="game.setResult(player.id, true)"
            >
              ✔ Giusto
            </button>
            <button
              class="btn btn-danger"
              @click="game.setResult(player.id, false)"
            >
              ✖ Sbagliato
            </button>
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
          <p v-if="player.resultCorrect === true" class="text-success fw-bold">
            ✅ Presa giusta
          </p>
          <p v-if="player.resultCorrect === false" class="text-danger fw-bold">
            ❌ Presa sbagliata
          </p>
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

    <p v-if="totalTaken !== game.currentCards && allSet">
      ⚠ La somma delle prese deve essere pari al numero di carte del turno ({{
        game.currentCards
      }})
    </p>
  </div>
</template>
