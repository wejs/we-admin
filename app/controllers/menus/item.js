import Controller from '@ember/controller';
import { debug } from '@ember/debug';

export default Controller.extend({
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
      debug('>>>>');
    },

    searchPage() {
      debug('2222222222222');
    }
  }
});