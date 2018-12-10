import Component from '@ember/component';
import { inject } from '@ember/service';
import { observer } from '@ember/object';

export default Component.extend({
  upload: inject('upload'),

  classNames: ['image-to-upload'],

  item: null,
  // local src file:
  src: null,

  init() {
    this._super(...arguments);
    this.parseImageUrl();
  },

  onChangeItem: observer('item', function() {
    this.parseImageUrl();
  }),

  parseImageUrl() {
    let item = this.get('item');
    if (!item) {
      return null;
    }

    this.readURL(item);
  },

  readURL(item) {
    let self = this;
    let reader = new FileReader();

    reader.onload = function (e) {
      if (!self.isDestroyed) {
        self.set('src', e.target.result);
      }
    };

    reader.readAsDataURL(item);
  },

  actions: {
    deleteItem() {
      const item = this.get('item');
      this.get('upload').removeImageFromUploadList(item);
    }
  }
});