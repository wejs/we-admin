import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

let ENV;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  image: Ember.inject.service(),

  init() {
    this._super(...arguments);
    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
  },

  model() {
    const systemSettings = (this.get('settings').get('systemSettings') || '');

    const themeModel = this.modelFor('settings.theme');

    return Ember.RSVP.hash({
      ENV: ENV,
      settings: systemSettings,
      themeModel: themeModel,
      themes: this.getThemeList()
    });
  },

  getThemeList() {
    let url = `${ENV.GLOBAL_HOST}/project-theme?limit=100&published=true`;
    return this.get('ajax')
    .request(url)
    .then((json) => json['project-theme'] );
  },

  actions: {
    save(data) {
      console.log('TODO! save', data);
    }
  }
});
