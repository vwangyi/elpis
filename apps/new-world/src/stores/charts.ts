// // apps/new-world/src/stores/charts.ts
// import { defineStore } from 'pinia';
// import { createSocket } from '@/socket/socket';

// const CHARTS_NAMESPACE = '/charts';

// export const useChartsStore = defineStore('charts', {
//   state: () => ({
//     socket: null,
//     chartData: []
//   }),
//   actions: {
//     connect() {
//       this.socket = createSocket(CHARTS_NAMESPACE);
//       this.socket.on('data:update', data => {
//         this.chartData = data;
//       });
//     }
//     // ...
//   }
// });
