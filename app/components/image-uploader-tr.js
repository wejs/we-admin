import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  upload: inject('upload'),

  classNames: ['image-uploader-tr'],
  tagName: 'tr',
  image: null,

  actions: {
    updateDescription() {
      let image = this.get('image');
      this.get('upload').updateImageDescription(image, image.description);
    }
  }
});