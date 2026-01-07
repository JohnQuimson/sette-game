<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';

const router = useRouter();
const game = useGameStore();

const names = ref(Array(game.playersCount).fill(''));
const extracting = ref(false);

function extractDealer() {
   extracting.value = true;
   setTimeout(() => {
      game.setPlayers(names.value);
      game.extractFirstDealer();
      extracting.value = false;
   }, 1200);
}

function startGame() {
   game.startGame();
   router.push('/turn');
}
</script>

<template>
   <div class="container py-5">
      <h2 class="mb-5">Inserisci i giocatori</h2>

      <!-- 👥 NOMI -->
      <div v-for="(n, i) in names" :key="i">
         <input v-model="names[i]" placeholder="Nome giocatore" class="form-control mb-2" />
      </div>

      <button class="btn btn-primary mt-3" @click="extractDealer">🎲 Estrai dealer</button>

      <p v-if="extracting">Estrazione in corso...</p>

      <div v-if="game.firstDealerName">
         <p>
            Dealer estratto: <strong>{{ game.firstDealerName }}</strong>
         </p>
         <button class="btn btn-success" :disabled="!game.firstDealerName" @click="startGame">Inizia a giocare</button>
      </div>

      <!-- 🃏 CARTE DA TOGLIERE -->
      <div class="alert alert-danger mt-3" v-if="game.cardsToRemove.length">
         Carte da togliere: {{ game.cardsToRemove.join(', ') }}
      </div>
   </div>
</template>
