import Service from '@ember/service';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @service settings;
  @service ajax;

  signup(data) {
    return this.ajax.request('/signup', {
      method: 'POST',
      data: data
    });
  }

  resetPassword(data) {
    const email = data.email;

    return this.ajax.request('/auth/forgot-password', {
      method: 'POST',
      data: { email: email }
    });
  }

  async validResetPasswordToken(userId, token) {
    const url = `/auth/${userId}/check-if-reset-password-token-is-valid`;

    const result = await this.ajax.request(url, {
      method: 'POST',
      data: {
        token: token
      }
    });

    if (result) {
      return result.isValid;
    } else {
      return false;
    }
  }
}