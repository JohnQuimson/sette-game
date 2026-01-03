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
  <h2>Risultato turno</h2>

  <ScoreTable />

  <div
    v-for="player in game.players"
    :key="player.id"
    style="margin-bottom: 12px"
  >
    <strong>{{ player.name }}</strong>

    <p>
      Dichiarate: <strong>{{ player.declared }}</strong>
    </p>

    <div>
      <button @click="game.setResult(player.id, true)">✔ Giusto</button>

      <button @click="game.setResult(player.id, false)">✖ Sbagliato</button>
    </div>

    <!-- SOLO SE SBAGLIATO -->
    <div v-if="player.resultCorrect === false">
      <label>
        Prese fatte:
        <input
          type="number"
          min="0"
          :max="game.currentCards"
          v-model.number="player.taken"
        />
      </label>
    </div>

    <!-- FEEDBACK -->
    <p v-if="player.resultCorrect === true">✅ Presa giusta</p>
    <p v-if="player.resultCorrect === false">❌ Presa sbagliata</p>
  </div>

  <button
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
</template>
