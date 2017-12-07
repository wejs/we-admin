import Ember from 'ember';
import layout from '../templates/components/mt-actions-comment';

export default Ember.Component.extend({
  layout,

  actions: {
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
