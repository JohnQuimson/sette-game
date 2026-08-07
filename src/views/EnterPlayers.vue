<script setup>
const defaultNames = ['John', 'Valde', 'Atta', 'Talu', 'Ste', 'Jery', 'Vale'];

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';

const router = useRouter();
const game = useGameStore();

const names = ref(Array(game.playersCount).fill(''));
const extracting = ref(false);

function selectDefaultName(name) {
  const emptyIndex = names.value.findIndex((n) => !n);

  if (emptyIndex !== -1) {
    names.value[emptyIndex] = name;
  }
}

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
  <div class="players-container">
    <div class="players-card shadow-lg">
      <h1 class="players-title mb-4">Giocatori</h1>

      <!-- 👥 NOMI -->
      <div class="players-inputs">
        <div v-for="(n, i) in names" :key="i" class="player-input-wrapper">
          <span class="player-number">
            {{ i + 1 }}
          </span>

          <input
            v-model="names[i]"
            :placeholder="'Nome giocatore ' + (i + 1)"
            class="form-control player-input"
          />
        </div>
      </div>

      <!-- 🏷️ NOMI RAPIDI -->
      <div class="quick-names">
        <h5>⚡ Scelta rapida</h5>

        <div class="quick-list">
          <button
            v-for="name in defaultNames"
            :key="name"
            type="button"
            class="quick-btn"
            @click="selectDefaultName(name)"
          >
            {{ name }}
          </button>
        </div>
      </div>

      <!-- 🎲 DEALER -->
      <div class="dealer-section">
        <button
          v-if="!game.firstDealerName"
          class="dealer-btn"
          @click="extractDealer"
        >
          🎲 Estrai Dealer
        </button>

        <transition name="fade">
          <p v-if="extracting" class="extracting">🎲 Estrazione in corso...</p>
        </transition>

        <div v-if="game.firstDealerName" class="dealer-card">
          <p>👑 Il Dealer è</p>

          <h2>
            {{ game.firstDealerName }}
          </h2>

          <div class="dealer-actions">
            <button
              class="start-btn"
              :disabled="!game.firstDealerName"
              @click="startGame"
            >
              🚀 Inizia a giocare
            </button>

            <button class="again-btn" @click="extractDealer">
              🎲 Estrai di nuovo
            </button>
          </div>
        </div>
      </div>

      <!-- 🃏 CARTE -->
      <transition name="fade">
        <div class="cards-box" v-if="game.cardsToRemove.length">
          <h5>🃏 Carte rimosse</h5>

          <p>
            {{ game.cardsToRemove.join(', ') }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.players-container {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 15px;
}

.players-card {
  width: 100%;
  max-width: 850px;

  background: white;

  border-radius: 25px;

  padding: 25px 35px;

  text-align: center;

  animation: appear 0.5s ease;
}

.players-inputs {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 12px;
}

.players-title {
  font-size: 2.8rem;

  font-weight: 800;

  background: linear-gradient(45deg, #0d6efd, #6610f2);

  -webkit-background-clip: text;
  color: transparent;
}

/* INPUT */

.player-input-wrapper {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 12px;
}

.player-number {
  width: 38px;
  height: 38px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background: #0d6efd;

  color: white;

  font-weight: bold;
}

.player-input {
  height: 50px;

  border-radius: 15px;

  font-size: 1.1rem;
}

/* NOMI RAPIDI */

.quick-names {
  margin-top: 20px;
}

.quick-list {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 10px;
}

.quick-btn {
  border-radius: 30px;

  padding: 8px 18px;

  border: 2px solid #0d6efd;

  background: white;

  color: #0d6efd;

  transition: 0.2s;
}

.quick-btn:hover {
  transform: translateY(-3px);

  background: #0d6efd;

  color: white;
}

/* DEALER */

.dealer-section {
  margin-top: 20px;
}

.dealer-btn {
  width: 100%;

  padding: 15px;

  border-radius: 20px;

  border: none;

  background: #0d6efd;

  color: white;

  font-size: 1.2rem;

  font-weight: bold;
}

.extracting {
  margin-top: 15px;

  animation: pulseText 1s infinite;
}

.dealer-card {
  margin-top: 15px;

  padding: 15px;

  border-radius: 20px;

  background: #fff3cd;
}

.dealer-card h2 {
  font-size: 2rem;

  font-weight: bold;
}

.dealer-actions {
  display: flex;

  flex-direction: row;

  justify-content: center;

  gap: 15px;
}

.start-btn {
  padding: 14px;

  border-radius: 20px;

  border: none;

  background: #198754;

  color: white;

  font-size: 1.2rem;

  font-weight: bold;
}

.again-btn {
  padding: 12px;

  border-radius: 20px;

  border: 2px solid #0d6efd;

  background: white;

  color: #0d6efd;
}

/* CARTE */

.cards-box {
  margin-top: 30px;

  background: #f8d7da;

  border-radius: 20px;

  padding: 15px;
}

/* ANIMAZIONI */

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  transform: translateY(20px);
}

@keyframes appear {
  from {
    opacity: 0;

    transform: scale(0.85);
  }

  to {
    opacity: 1;

    transform: scale(1);
  }
}

@keyframes pulseText {
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 600px) {
  .players-inputs {
    grid-template-columns: 1fr;
  }

  .dealer-actions {
    flex-direction: column;
  }
}
</style>
