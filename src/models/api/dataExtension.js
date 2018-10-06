export default class DataExtension {

  constructor() {
    this.id = '';
    this.name = '';
    this.key = '';
    this.description = '';

    this.isSendable = false;
    this.isTestable = false;

    this.steps = [{
      label: 'Step 1',
      key: 'step_1'
    }];
    this.splits = [];
    this.schemaArgs = [];
  }
}