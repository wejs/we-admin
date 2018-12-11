import Component from '@ember/component';
import { inject } from '@ember/service';
import { observer } from '@ember/object';

export default Component.extend({
  upload: inject('upload'),

  classNames: ['file-to-upload'],

  item: null,
  // local src file:
  src: null,

  init() {
    this._super(...arguments);
  },

  actions: {
    deleteItem() {
      const item = this.get('item');
      this.get('upload').removeFileFromUploadList(item);
    }
  }
});