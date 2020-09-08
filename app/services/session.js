import { inject as service } from '@ember/service';
import BaseSessionService from 'ember-simple-auth/services/session';

export default class SessionService extends BaseSessionService {
  @service currentUser;

  async handleAuthentication() {
    super.handleAuthentication(...arguments);

    try {
      await this.currentUser.load();
    } catch (err) {
      await this.invalidate();
    }

  }

  async handleInvalidation() {
    try {
      await this.currentUser.load();
    } catch (e) {
      console.error('Error on handleInvalidation', {
        error: e
      });
    }
  }
}
