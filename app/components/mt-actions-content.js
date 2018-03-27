import Ember from 'ember';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('ENV', Ember.getOwner(this).resolveRegistration('config:environment'));
  },
  actions: {
    changePublishedStatus() {
      this.sendAction('changePublishedStatus', ...arguments);
    },
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
