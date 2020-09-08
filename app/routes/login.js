import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// import config from '../config/environment';

export default class LoginRoute extends Route {
  @service session;

  title = 'Autenticar-se';

  beforeModel() {
    sessionStorage.removeItem('redirectToThisAfterLogin');
    this.session.prohibitAuthentication('dash');
  }
}
