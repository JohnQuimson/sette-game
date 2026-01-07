import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
   state: () => ({
      playersCount: 0,
      players: [],

      cardsToRemove: [],

      turns: [], // es: [7,6,5,4,3,2,1,1,2,3,4,5,6,7]
      currentTurnIndex: 0,

      firstDealerIndex: null,
   }),

   getters: {
      // ---- TURNI ----
      currentCards(state) {
         return state.turns[state.currentTurnIndex];
      },

      currentTurnNumber(state) {
         return state.currentTurnIndex + 1;
      },

      isGameFinished(state) {
         return state.currentTurnIndex >= state.turns.length;
      },

      // ---- DEALER ----
      currentDealerIndex(state) {
         if (state.firstDealerIndex === null) return null;
         return (state.firstDealerIndex + state.currentTurnIndex) % state.players.length;
      },

      currentDealerId(state) {
         return state.players[this.currentDealerIndex]?.id;
      },

      currentDealerName(state) {
         return state.players[this.currentDealerIndex]?.name;
      },

      firstDealerName(state) {
         return state.players[state.firstDealerIndex]?.name;
      },

      // ---- DICHIARAZIONE VIETATA DEALER ----
      forbiddenDealerDeclaration(state) {
         const dealerId = state.currentDealerId;

         const sumOthers = state.players
            .filter((p) => p.id !== dealerId)
            .reduce((sum, p) => sum + (p.declared ?? 0), 0);

         return state.currentCards - sumOthers;
      },
      // ---- CLASSIFICA ----
      ranking(state) {
         return [...state.players].sort((a, b) => b.points - a.points);
      },
   },

   actions: {
      // -------------------------
      // SETUP INIZIALE
      // -------------------------
      setPlayersCount(count) {
         this.playersCount = count;
      },

      calculateCardsToRemove() {
         const totalCards = 52;
         const used = this.playersCount * 7 + 1; // + briscola
         const toRemove = totalCards - used;

         const fullQuads = Math.floor(toRemove / 4);

         const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
         this.cardsToRemove = values.slice(0, fullQuads);
      },

      setPlayers(names) {
         this.players = names.map((name, index) => ({
            id: index,
            name,
            points: 0,
            declared: 0,
            taken: null,
            resultCorrect: null,
            turns: [],
            turnsCorrect: [],
         }));
      },

      extractFirstDealer() {
         this.firstDealerIndex = Math.floor(Math.random() * this.players.length);
      },

      startGame() {
         this.turns = [7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7];
         this.currentTurnIndex = 0;
      },

      // -------------------------
      // DICHIARAZIONI
      // -------------------------
      setDeclaration(playerId, value) {
         const player = this.players.find((p) => p.id === playerId);
         if (!player) return;

         // controllo dealer
         if (playerId === this.currentDealerId) {
            if (value === this.forbiddenDealerDeclaration) return;
         }

         player.declared = value;
      },

      // -------------------------
      // RISULTATI TURNO
      // -------------------------
      setResult(playerId, correct) {
         const player = this.players.find((p) => p.id === playerId);
         if (!player) return;

         player.resultCorrect = correct;

         if (correct) {
            player.taken = player.declared;
         } else {
            player.taken = null;
         }
      },

      // quando chiudi un turno
      closeTurn() {
         this.players.forEach((player) => {
            let pointsThisTurn = 0;
            let correct = false;

            if (player.resultCorrect === true) {
               pointsThisTurn = 10 + player.declared;
               correct = true;
            } else {
               pointsThisTurn = player.taken ?? 0;
               correct = false;
            }

            // salva punti del turno
            player.turns[this.currentTurnIndex] = pointsThisTurn;

            // salva ESITO del turno (NUOVO)
            player.turnsCorrect[this.currentTurnIndex] = correct;

            // reset campi temporanei
            player.declared = 0;
            player.taken = null;
            player.resultCorrect = null;
         });

         this.currentTurnIndex++;
      },

      // -------------------------
      // RESET
      // -------------------------
      resetGame() {
         this.$reset();
      },
   },
});
