import Ember from 'ember';
import layout from '../templates/components/menu-links-sort-item';

export default Ember.Component.extend({
  layout,

  onSortEnd: 'onSortEnd',
  deleteLink: 'deleteLink',

  link: null,
  hideForm: true,
  group: null,
  parentDepth: 0,
  classNames: ['m-list-group-item'],

  actions: {
    onSortEnd() {
      this.sendAction('onSortEnd', ...arguments);
    },
    deleteLink() {
      this.sendAction('deleteLink', ...arguments);
    },

    openEditForm(v) {
      this.set('hideForm', v);
    }
  }
});
