import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  upload: inject('upload'),

  classNames: ['file-upload-image-selector'],

  input: null,
  inputContainer: null,

  didInsertElement() {
    this._super(...arguments);

    const element = this.get('element');

    const input = element.querySelector('.input-file');

    this.set(
      'inputContainer',
      element.querySelector('.input-file-inp-container')
    );

    this.set('input', input);
    this.setInputEvents();
  },

  resetInput() {
    const input = this.get('input');
    input.value = null;

    const element = this.get('inputContainer');
    element.innerHTML = '';
    element.appendChild(input.cloneNode(true));
    this.setInputEvents();
  },

  setInputEvents() {
    this.get('element')
    .querySelector('.input-file')
    .addEventListener('change', (event)=> {
       this.onChangeInputFile(event);
    });
  },

  onChangeInputFile(r) {
    if (r.target.files && r.target.files && r.target.files.length) {
      for (let i = 0; i < r.target.files.length; i++) {
        this.get('upload').addImageToUpload(r.target.files[i]);
      }
    }

    this.resetInput();
  },
});