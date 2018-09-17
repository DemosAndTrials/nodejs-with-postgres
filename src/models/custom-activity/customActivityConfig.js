import {
  v4 as uuid
} from 'uuid';
import { getConnection } from '../../utils/postgresUtils';

export default class CustomActivityConfig {

  constructor(host) {
    this.id = '';
    this.name = 'My Custom Activity';
    this.key = uuid();
    this.type = '';
    this.description = '';
    //this.smallImageUrl = '';
    //this.bigImageUrl = '';
    this.isConfigured = false;
    this.configOnDrop = false;
    //this.editUrl = '';
    this.editHeight = 600;
    this.editWidth = 800;
    //this.endpointUrl = '';
    this.useJwt = false;
    this.steps = [{
      label: 'Step 1',
      key: 'step_1'
    }];
    this.splits = [];
    this.schemaArgs = [];

    this.endpointUrl = host + '/ca';
    this.editUrl = host + '/ca/ui';
    this.bigImageUrl = host + '/images/ca/icon.png';
    this.smallImageUrl = host + '/images/ca/icon_small.png';
  }

  // set id(id) {
  //   this._id = id;
  // }

  // get id() {
  //   return this._id;
  // }

  // set key(value) {
  //   this._key = value;
  // }

  // get key() {
  //   return this._key;
  // }

  // set name(value) {
  //   this._name = value;
  // }

  // get name() {
  //   return this._name;
  // }

  // set type(value) {
  //   this._type = value;
  // }

  // get type() {
  //   return this._type;
  // }

  // sayHello() {
  //   console.log('Hello, my name is ' + this.name + ', I have ID: ' + this.id);
  // }
}