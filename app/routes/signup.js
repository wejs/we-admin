import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default class SignupRoute extends Route {
  title = 'Registrar-se';

  model() {
    return hash({
      user: {
        acceptTerms: false
      }
    });
  }
}