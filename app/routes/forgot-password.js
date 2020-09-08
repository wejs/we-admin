import ENV from "../config/environment";

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { debug } from '@ember/debug';
import { action } from '@ember/object';

export default class LoginRoute extends Route {
  @service session;
  @service notifications;
  @service ajax;

  title = 'Recuperar senha';

  beforeModel() {
    sessionStorage.removeItem('redirectToThisAfterLogin');
    this.session.prohibitAuthentication('dash');
  }

  model() {
    return {
      email: ''
    };
  }

  @action
  requestPasswordChange() {
    const email = this.get('currentModel.email');

    if (!email) {
      debug('email is required');
      return;
    }

    this.ajax.request(`${ENV.API_HOST}/auth/forgot-password`, {
      method: 'POST',
      data: {
        email: email
      }
    })
    .then((result) => {
      // reset email:
      this.set('currentModel.email', '');
      // then show the result as notification:
      if (result && result.messages) {
        result.messages.forEach((m) => {
          if (m.status === 'success') {
            this.get('notifications').success(m.message);
          } else {
            this.get('notifications').error(m.message);
          }
        });
      } else {
        debug('Unknow success response on forgot-password page');
      }
    });
  }
}
