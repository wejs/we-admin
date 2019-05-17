import Component from '@ember/component';
import { inject } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  image: inject('image'),
  images: A(),
  onSelectImage: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.getLastUserImages();
  },

  getLastUserImages() {
    this.get('image').getLastUserImages()
    .then( (images)=> {
      if (images && images.length) {
        this.set('images', images);
      }
    });
  },

  actions: {
    onSelectImage(image) {
      let onSelectImage = this.get('onSelectImage');
      if (onSelectImage) {
        onSelectImage(image);
      }
    }
  }
});
