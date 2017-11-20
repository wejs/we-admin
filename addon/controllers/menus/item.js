import Ember from 'ember';

export default Ember.Controller.extend({
  linkTargetOptions: [
    'Na mesma página',
    'Em uma nova página'
  ],
  advancedFieldsCollapsed: true,

  actions: {
    toggleAdvancedFields() {
      if (this.get('advancedFieldsCollapsed')) {
        this.set('advancedFieldsCollapsed', false);
      } else {
        this.set('advancedFieldsCollapsed', true);
      }
    },
    selectTarget() {



    },
    onSaveLink(link, modal) {
      this.send('saveLink', link, modal);
    },
    onCloseLinkEditModal() {
      this.send('onCloseLinkModal');
    }
  }
});