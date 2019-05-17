import Component from '@ember/component';

export default Component.extend({
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
