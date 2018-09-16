export default class CustomActivityConfig {

  constructor() {

  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set key(key) {
    this._key = key;
  }

  get key() {
    return this._key;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  sayHello() {
    console.log('Hello, my name is ' + this.name + ', I have ID: ' + this.id);
  }
}