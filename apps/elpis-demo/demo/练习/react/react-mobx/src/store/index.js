import { makeAutoObservable } from 'mobx'

export default new (class Store {
  constructor() {
    makeAutoObservable(this)
  }

  counter = 0

  // todolist
  list = []

  add(newItem) {
    this.list.push(newItem)
  }

  remove(id) {
    this.list = this.list.filter((item) => item.id !== id)
  }
})()
