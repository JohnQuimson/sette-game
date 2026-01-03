import { createRouter, createWebHistory } from 'vue-router';

import StartGame from '@/views/StartGame.vue';
import EnterPlayers from '@/views/EnterPlayers.vue';
import GameTurn from '@/views/GameTurn.vue';
import Declarations from '@/views/Declarations.vue';
import TurnResult from '@/views/TurnResult.vue';
import Result from '@/views/Result.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/start' },

    { path: '/start', component: StartGame },
    { path: '/players', component: EnterPlayers },
    { path: '/turn', component: GameTurn },
    { path: '/declarations', component: Declarations },
    { path: '/turn-result', component: TurnResult },
    { path: '/result', component: Result },
  ],
});

export default router;
