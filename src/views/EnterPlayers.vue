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
      <h2 class="mb-5">Nomi Giocatori</h2>

      <!-- 👥 NOMI -->
      <div v-for="(n, i) in names" :key="i">
         <input v-model="names[i]" placeholder="Nome giocatore" class="form-control mb-2" />
      </div>

      <button v-if="!game.firstDealerName" class="btn btn-primary mt-3" @click="extractDealer">🎲 Estrai dealer</button>

      <p v-if="extracting">Estrazione in corso...</p>

      <div class="mt-5" v-if="game.firstDealerName">
         <p class="fs-3">
            Il Dealer è: <strong>{{ game.firstDealerName }}</strong>
         </p>
         <div class="d-flex align-items-center gap-3">
            <button class="btn btn-success" :disabled="!game.firstDealerName" @click="startGame">
               Inizia a giocare
            </button>
            o
            <button class="btn btn-primary" @click="extractDealer">🎲 Estrai di nuovo</button>
         </div>
         <!-- <button class="btn btn-success" :disabled="!game.firstDealerName" @click="startGame">Inizia a giocare</button> -->
      </div>

      <!-- 🃏 CARTE DA TOGLIERE -->
      <div class="alert alert-danger mt-5" v-if="game.cardsToRemove.length">
         Carte da togliere: {{ game.cardsToRemove.join(', ') }}
      </div>
   </div>
</template>
