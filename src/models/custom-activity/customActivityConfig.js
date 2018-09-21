import {
  v4 as uuid
} from 'uuid';

export default class CustomActivityConfig {

  constructor(host) {
    this.id = '';
    this.name = 'My Custom Activity';
    this.key = uuid();
    this.type = '';
    this.description = '';
    this.is_configured = false;
    this.config_on_drop = false;
    this.edit_height = 600;
    this.edit_width = 800;
    this.use_jwt = false;
    this.steps = [{
      label: 'Step 1',
      key: 'step_1'
    }];
    this.splits = [];
    this.schemaArgs = [];
    this.endpoint_url = host + '/ca';
    this.edit_url = host + '/ca/ui';
    this.big_image_url = host + '/images/ca/icon.png';
    this.small_image_url = host + '/images/ca/icon_small.png';
  }
}