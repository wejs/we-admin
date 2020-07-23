import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';

export default class ToriiFacebookAuthenticator extends Torii {
  @service torii;

  async authenticate() {
    const tokenExchangeUri = config.torii.providers['facebook-oauth2'].tokenExchangeUri;
    let data = await super.authenticate(...arguments);

    const response = await fetch(tokenExchangeUri, {
      // Adding method type
      method: "POST",
      // no-cors, *cors, same-origin
      mode: 'cors',
      // Adding body or contents to send
      body: JSON.stringify({
        // fb_access_token: data.authorizationCode,
        code: data.authorizationCode,
        redirectUri: data.redirectUri
      }),
      // Adding headers to the request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const rd = await response.json();

    return {
      access_token: rd.token.access_token,
      refresh_token: rd.token.refresh_token,
      expire_date: rd.token.expireDate,
      provider: 'facebook',
      email: rd.user.email,
      id: rd.user.id
    };
  }
}
