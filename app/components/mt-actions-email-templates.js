import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
