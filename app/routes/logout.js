import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service session;

  title = 'Sair';

  model() {
    document.cookie = 'wejs.sid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.session.invalidate().then(() => {
      location.href = '/login';
    });
  }
}
