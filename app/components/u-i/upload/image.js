import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { computed, action } from '@ember/object';
// import { oneWay } from '@ember/object/computed';

import { alias } from '@ember/object/computed';

export default class UIUploadImageComponent extends Component {
  @service upload;

  @alias('args.field') field;

  @computed('args.{multiple,field.[]}')
  get canAddMore () {
    if (this.args.multiple) {
      return true;
    } else {
      if (this.args.field.length == 0) {
        return true;
      } else {
        return false
      }
    }
  }

  @action
  async uploadFile(file) {
    console.log('file>>', file);

    let data = await this.upload
      .submitFile(file, 'image', '/api/v1/image');

    if (data.body && data.body.image) {
      if (this.args.multiple) {
        alert('TODO!');
      } else {
        // set(this, 'field', data.body.image);
        this.field.pushObject(data.body.image);
      }
    }
  }

  @action
  async removeFile(file) {
    this.field.removeObject(file);
  }
}
