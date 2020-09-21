import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Promise, hash } from 'rsvp';

export default class AuthenticatedRoute extends Route {
  @service session;
  @service settings;
  @service router;

  beforeModel(transition) {
    sessionStorage.removeItem('redirectToThisAfterLogin');
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return hash({
      loadedSettings: this.settings.getUserSettings(),
      minimumLoadingDelay: new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
    });
  }

  afterModel(model) {
    return model;
  }
}
