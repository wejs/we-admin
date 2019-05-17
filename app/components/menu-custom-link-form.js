import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject('store'),

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
