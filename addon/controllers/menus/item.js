import Ember from 'ember';

export default Ember.Controller.extend({
  advancedFieldsCollapsed: true,

  actions: {
    toggleAdvancedFields() {
      if (this.get('advancedFieldsCollapsed')) {
        this.set('advancedFieldsCollapsed', false);
      } else {
        this.set('advancedFieldsCollapsed', true);
      }
    },
    onSaveLink(link, modal) {
      this.send('saveLink', link, modal);
    },
    onCloseLinkEditModal() {
      this.send('onCloseLinkModal');
    },

    searchPages() {
      console.log('>>>>');
    },

    searchPage() {
      console.log('2222222222222');
    }
  }
});