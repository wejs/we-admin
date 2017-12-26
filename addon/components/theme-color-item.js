import Ember from 'ember';
import layout from '../templates/components/theme-color-item';

export default Ember.Component.extend({
  layout,
  tagName: 'span',
  classNames: ['theme-color-item'],
  attributeBindings: ['style', 'width'],
  width: '30',
  color: '#fff',
  style: Ember.computed('color', function() {
    let color = this.get('color');
    if (!color) {
      color = '#fff';
    }
    return Ember.String.htmlSafe('background-color: '+color+'; color:'+color+';');
  })
});
