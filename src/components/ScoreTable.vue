<script setup>
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore.js';

const game = useGameStore();

// Genero l’array dei turni 7→1 e poi 1→7
const allTurns = computed(() => {
  const firstPhase = Array.from({ length: 7 }, (_, i) => 7 - i); // 7,6,...1
  const secondPhase = Array.from({ length: 7 }, (_, i) => i + 1); // 1,2,...7
  return [...firstPhase, ...secondPhase];
});

// Tabella: punti cumulativi per turni già giocati
const tableData = computed(() => {
  const data = [];
  const cumulative = game.players.map(() => 0); // array cumulativo per giocatori

  allTurns.value.forEach((turn, index) => {
    const rowPoints = game.players.map((player, i) => {
      const pointsThisTurn = player.turns?.[index];
      if (pointsThisTurn !== undefined && pointsThisTurn !== null) {
        cumulative[i] += pointsThisTurn; // somma cumulativa
        return cumulative[i];
      }
      return ''; // turno non ancora giocato
    });

    data.push({ turn, points: rowPoints });
  });

  return data;
});
</script>

<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center">
      <thead class="table-dark">
        <tr>
          <th>Turno</th>
          <th v-for="player in game.players" :key="player.id">
            {{ player.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in tableData" :key="idx">
          <td>{{ row.turn }}</td>
          <td v-for="(point, i) in row.points" :key="i">{{ point }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
