import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';

export default Component.extend({
  tagName: 'span',
  classNames: ['theme-color-item'],
  attributeBindings: ['style', 'width'],
  width: '30',
  color: '#fff',
  style: computed('color', function() {
    let color = this.get('color');
    if (!color) {
      color = '#fff';
    }
    return htmlSafe('background-color: '+color+'; color:'+color+';');
  })
});
