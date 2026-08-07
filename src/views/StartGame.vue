<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore.js';

const router = useRouter();
const game = useGameStore();

const playersCount = ref(4);

function start() {
  game.setPlayersCount(playersCount.value);
  game.calculateCardsToRemove();
  router.push('/players');
}
</script>

<template>
  <div class="start-container">
    <div class="game-card shadow-lg">
      <div class="mb-4">
        <h1 class="game-title">Sette</h1>

        <p class="text-muted fs-5">Quanti giocatori partecipano?</p>
      </div>

      <!-- Numero selezionato -->
      <div class="player-display">
        <span>{{ playersCount }}</span>
        <small>giocatori</small>
      </div>

      <!-- Tastierino giocatori -->
      <div class="player-pad">
        <button
          v-for="n in [4, 5, 6, 7]"
          :key="n"
          class="player-btn"
          :class="{ active: playersCount === n }"
          @click="playersCount = n"
        >
          {{ n }}
        </button>
      </div>

      <button class="start-btn mt-4" @click="start">Inizia partita</button>

      <!-- Carte tolte -->
      <transition name="fade">
        <div v-if="game.cardsToRemove.length" class="cards-box mt-5">
          <h5>🃏 Carte da togliere</h5>

          <p>
            {{ game.cardsToRemove.join(', ') }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.start-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  background: radial-gradient(circle at top, #e3f2fd, #ffffff);
}

.game-card {
  width: 100%;
  max-width: 420px;

  background: white;
  border-radius: 25px;

  padding: 35px 25px;

  text-align: center;

  animation: appear 0.5s ease;
}

.game-title {
  font-size: 3rem;
  font-weight: 800;

  background: linear-gradient(45deg, #0d6efd, #6610f2);

  -webkit-background-clip: text;
  color: transparent;
}

.player-display {
  width: 140px;
  height: 140px;

  margin: 20px auto;

  border-radius: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  background: #f8f9fa;

  border: 5px solid #0d6efd;

  animation: pulse 2s infinite;
}

.player-display span {
  font-size: 4rem;
  font-weight: bold;
  color: #0d6efd;
}

.player-display small {
  color: #6c757d;
}

.player-pad {
  display: grid;

  grid-template-columns: repeat(2, 90px);

  gap: 15px;

  justify-content: center;
}

.player-btn {
  height: 70px;

  border-radius: 20px;

  border: 2px solid #0d6efd;

  background: white;

  color: #0d6efd;

  font-size: 2rem;

  font-weight: bold;

  cursor: pointer;

  transition: all 0.2s ease;
}

.player-btn:hover {
  transform: translateY(-5px);
}

.player-btn.active {
  background: #0d6efd;

  color: white;

  transform: scale(1.1);
}

.start-btn {
  width: 100%;

  padding: 15px;

  border: none;

  border-radius: 20px;

  background: linear-gradient(45deg, #198754, #20c997);

  color: white;

  font-size: 1.3rem;

  font-weight: bold;

  transition: 0.2s;
}

.start-btn:hover {
  transform: scale(1.04);
}

.cards-box {
  background: #fff3cd;

  border-radius: 15px;

  padding: 15px;
}

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
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4);
  }

  70% {
    box-shadow: 0 0 0 20px rgba(13, 110, 253, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
  }
}
</style>
