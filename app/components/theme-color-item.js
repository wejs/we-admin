import Ember from 'ember';

export default Ember.Component.extend({
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
