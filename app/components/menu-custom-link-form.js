import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),

  addLink: 'addLink',

  link: null,

  init() {
    this._super(...arguments);

    this.resetLink();
  },

  resetLink() {
    this.set('link', this.get('store').createRecord('link', {
      type: 'custom'
    }));
  },

  actions: {
    addLink(link) {
      this.resetLink();
      this.sendAction('addLink', link);
    }
  }
});
