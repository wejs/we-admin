import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['field-creator-selector'],
  record: null,

  init() {
    this._super(...arguments);
    this.set('ENV', Ember.getOwner(this).resolveRegistration('config:environment'));
  },

  actions: {
    findUsers(term) {
      const ENV = this.get('ENV');
      let url = `${ENV.API_HOST}/user?displayName_contains=${term}`;
      return this.get('ajax')
      .request(url)
      .then((json) => {
        // add current term in  terms returned from backend search:
        json.user.push(term);
        return json.user;
      });
    }
  }
});