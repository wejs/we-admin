import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  upload: inject('upload'),

  file: null,

  actions: {
    updateDescription() {
      let file = this.get('file');
      this.get('upload').updateFileDescription(file, file.description);
    }
  }
});