import Component from '@ember/component';
import { isArray } from '@ember/array';
import { get } from '@ember/object';
import { inject } from '@ember/service';

/**
 * Ember.js image component visualizer
 *
 * @author Alberto Souza <contato@albertosouza.net>
 * @examples
 *   {{we-image file=imageModel size="medium"}}
 */
export default Component.extend({
  settings: inject(),

  tagName: 'img',
  attributeBindings: ['src:src', 'hidden:hidden'],

  src: null,
  file: null,
  // size: original, large, medium, small, thumbnail
  size: 'medium',
  hidden: false,

  defaultSrc: null,

  init() {
    this._super();

    let file = this.file;

    if (isArray(file)) {
      if (file.firstObject) {
        file = get(file, 'firstObject');
      } else {
        file = file[0];
      }
    }

    // file.urls is required
    if (!file || !file.urls) {
      if (this.defaultSrc) {
        this.set('src', this.defaultSrc);
      } else {
        this.set('hidden', true);
      }

      return;
    }

    let src = get(file, 'urls.' + this.size);

    if (src.startsWith('HTT')) {
      this.set('src', src);
    } else {
      this.set('src', this.settings.ENV.imageHost + src);
    }
  }
});
