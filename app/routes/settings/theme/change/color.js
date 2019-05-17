import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { hash } from 'rsvp';
import { debug } from '@ember/debug';

let ENV;

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: inject(),
  init() {
    this._super(...arguments);
    ENV = getOwner(this).resolveRegistration('config:environment');
  },

  model(params) {
    const systemSettings = (this.get('settings').get('systemSettings') || '');

    const themeModel = this.modelFor('settings.theme');

    return hash({
      ENV: ENV,
      settings: systemSettings,
      themeModel: themeModel,
      theme: this.getThemeList(params)
    });
  },

  getThemeList(params) {
    let url = `${ENV.GLOBAL_HOST}/project-theme/${params.id}`;
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
