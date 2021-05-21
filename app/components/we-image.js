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
  attributeBindings: ['src:src'],

  src: null,
  file: null,
  // size: original, large, medium, small, thumbnail
  size: 'medium',

  init() {
    this._super();

    let file = this.get('file');

    if (isArray(file)) {
      if (file.firstObject) {
        file = get(file, 'firstObject');
      } else {
        file = file[0];
      }
    }

    // file.urls is required
    if (!file || !file.urls) {
      return ;
    }

    let src = get(file, 'urls.'+this.get('size'));

    if (src.startsWith('HTT') || src.startsWith('htt')) {
      this.set('src', src);
    } else {
      this.set('src', this.get('settings.ENV.imageHost') + src);
    }
  }
});
