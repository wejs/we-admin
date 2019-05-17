import EmberPowerSelect from 'ember-power-select/components/power-select-multiple';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default EmberPowerSelect.extend({
  i18n: inject(),

  searchEnabled: true,

  loadingMessage: computed('i18n.locale', function() {
    return this.get('i18n').t('selects.loading');
  }),
  noMatchesMessage: computed('i18n.locale', function() {
    return this.get('i18n').t('selects.no-results-found');
  }),
  searchMessage: computed('i18n.locale', function() {
    return this.get('i18n').t('selects.type-to-search');
  })
});