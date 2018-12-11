import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  upload: inject('upload'),

  classNames: ['file-uploader-tr'],
  tagName: 'tr',
  image: null,

  actions: {
    updateDescription() {
      let file = this.get('file');
      this.get('upload').updateFileDescription(file, file.description);
    },
    removeFile(file) {
      this.sendAction('removeFile', file);
    }
  }
});