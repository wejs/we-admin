import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';
import { getOwner } from '@ember/application';

export default class ToriiFacebookAuthenticator extends Torii {
  @service torii;
  @service ajax;

  async authenticate() {
    const tokenExchangeUri = config.torii.providers['facebook-oauth2'].tokenExchangeUri;
    let data = await super.authenticate(...arguments);

    const rd = await this.ajax.request(tokenExchangeUri, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      data: {
        // fb_access_token: data.authorizationCode,
        code: data.authorizationCode,
        redirectUri: data.redirectUri
      }
    });

    return {
      access_token: rd.token.access_token,
      refresh_token: rd.token.refresh_token,
      expire_date: rd.token.expireDate,
      provider: 'facebook',
      email: rd.user.email,
      id: rd.user.id
    };
  }

  invalidate() {
    const ENV = getOwner(this).resolveRegistration('config:environment');
    return this.ajax.request(ENV.API_HOST + '/auth/logout', {});
  }
}
