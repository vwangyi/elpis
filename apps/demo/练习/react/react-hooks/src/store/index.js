import { makeAutoObservable } from 'mobx';

class Store {
  // 固定的
  constructor() {
    makeAutoObservable(this);
  }

  // 类似于vuex中的state
  counter = 0;

  // 类似于vuex中的mutation
  addCounter() {
    this.counter++;
  }
}

export default new Store();
