import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    searchPages(term) {
      return this.get('store').query('content', {
        'title_starts-with': term,
        limit: 10
      });
    },
    selectPage(page) {
      this.set('model.selectedPage', page);
    }
  }
});