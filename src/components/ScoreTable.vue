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

// Tabella: punti solo per turni già giocati
const tableData = computed(() => {
  const data = allTurns.value.map((turn, index) => {
    const rowPoints = game.players.map((player) => {
      return player.turns?.[index] ?? ''; // vuoto se turno non ancora giocato
    });
    return { turn, points: rowPoints };
  });

  // Riorganizzo in ordine decrescente: 7→1 prima fase, poi 1→7 seconda fase
  const firstPhaseRows = data.slice(0, 7); // 7→1
  const secondPhaseRows = data.slice(7); // 1→7
  return [...firstPhaseRows, ...secondPhaseRows];
});
</script>

<template>
  <table border="1" cellpadding="6" cellspacing="0">
    <thead>
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
</template>
