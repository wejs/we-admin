import Ember from 'ember';
import layout from '../templates/components/menu-links-sort-item';

export default Ember.Component.extend({
  layout,
  onSortEnd: 'onSortEnd',
  link: null,
  group: null,
  parentDepth: 0,
  classNames: ['m-list-group-item'],

  actions: {
    onSortEnd() {
      this.sendAction('onSortEnd', ...arguments);
    }
  }
});
