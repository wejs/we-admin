import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';

export default class ToriiGithubAuthenticator extends Torii {
  @service torii;

  async authenticate() {
    const tokenExchangeUri = config.torii.providers['github-oauth2'].tokenExchangeUri;
    let data = await super.authenticate(...arguments);
    const response = await fetch(tokenExchangeUri, {
      // Adding method type
      method: "POST",
      // no-cors, *cors, same-origin
      mode: 'cors',
      // Adding body or contents to send
      body: JSON.stringify({
        code: data.authorizationCode
      }),
      // Adding headers to the request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const rd = await response.json();

    return {
      access_token: rd.access_token,
      provider: 'github',
      email: rd.user.email,
      id: rd.user.id
    };
  }
}
