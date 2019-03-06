import Ember from 'ember';
import Component from '@ember/component';

/**
 * Ember.js image component visualizer
 *
 * @author Alberto Souza <contato@albertosouza.net>
 * @examples
 *   {{we-image file=imageModel size="medium"}}
 */
export default Component.extend({
  tagName: 'img',
  attributeBindings: ['src:src'],

  src: null,
  file: null,
  // size: original, large, medium, small, thumbnail
  size: 'medium',

  init() {
    this._super();

    let file = this.get('file');

    if (Ember.isArray(file)) {
      if (file.firstObject) {
        file = Ember.get(file, 'firstObject');
      } else {
        file = file[0];
      }
    }

    // file.urls is required
    if (!file || !file.urls) {
      return ;
    }

    let src = Ember.get(file, 'urls.'+this.get('size'));
    this.set('src', src);
  }
});
