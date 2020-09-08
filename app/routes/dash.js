import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class AuthenticatedRoute extends Route {
  @service session;
  @service settings;

  beforeModel(transition) {
    sessionStorage.removeItem('redirectToThisAfterLogin');
    this.session.requireAuthentication(transition, 'login');
  }

  model() {
    return hash({
      loadedSettings: this.settings.getUserSettings(),
      minimumLoadingDelay: new window.Promise( (resolve)=> {
        setTimeout( ()=> {
          resolve();
        }, 500);
      })
    });
  }

  afterModel(model) {
    return model;
  }
}
