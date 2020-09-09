import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default class LogoutRoute extends Route {
  @service session;

  title = 'Sair';

  model() {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    document.cookie = 'wejs.sid=;expires=Thu, 01 Jan 1980 00:00:01 GMT;';
    this.session.invalidate().then(() => {
      location.href = (ENV.rootURL || '/') + 'login';
    });
  }
}
