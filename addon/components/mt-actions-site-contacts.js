import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    changeStatus() {
      this.sendAction('changeStatus', ...arguments);
    }
  }
});
