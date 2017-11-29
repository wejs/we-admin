import Ember from 'ember';
import layout from '../templates/components/mt-actions-sitecontact-form';

export default Ember.Component.extend({
  layout,

  actions: {
    changePublishedStatus() {
      this.sendAction('changePublishedStatus', ...arguments);
    },
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
