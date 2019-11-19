import Component from '@ember/component';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  upload: inject('upload'),

  image: null,
  file: alias('image'),

  actions: {
    updateDescription() {
      let image = this.get('image');
      this.get('upload').updateImageDescription(image, image.description);
    }
  }
});
