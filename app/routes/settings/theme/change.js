import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { hash } from 'rsvp';
import { debug } from '@ember/debug';

let ENV;

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: inject(),
  image: inject(),

  init() {
    this._super(...arguments);
    ENV = getOwner(this).resolveRegistration('config:environment');
  },

  model() {
    const systemSettings = (this.get('settings').get('systemSettings') || '');

    const themeModel = this.modelFor('settings.theme');

    return hash({
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
      debug('TODO! save', data);
    }
  }
});
