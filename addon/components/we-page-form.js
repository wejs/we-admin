import Ember from 'ember';
import layout from '../templates/components/we-page-form';

export default Ember.Component.extend({
  layout,

  showActionBar: true,
  isLoading: false,

  page: null,
  alias: null,

  onSavePage: null,
  onCancelSave: null,

  actions: {
    savePage(page, alias) {
      let savePageActionName = this.get('onSavePage');
      if (!savePageActionName) {
        return null;
      } else {
        this.sendAction(savePageActionName, page, alias, this);
      }
    },
    searchCategoryTerms(term) {
      const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

      let url = `${ENV.API_HOST}/api/v1/term-texts?term=${term}&vocabularyName=Category`;
      return this.get('ajax')
      .request(url)
      .then((json) => json.term );
    },
    searchTagsTerms(term) {
      const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

      let url = `${ENV.API_HOST}/api/v1/term-texts?term=${term}&vocabularyName=Tags`;
      return this.get('ajax')
      .request(url)
      .then((json) => {
        // add current term in  terms returned from backend search:
        json.term.push(term);
        return json.term;
      });
    },
    changeDate(record, field, dates) {
      if (!dates || !dates[0]) {
        return;
      }
      this.get('model.record').set(field, dates[0]);
    }
  }
});
