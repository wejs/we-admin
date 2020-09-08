import { inject as service } from '@ember/service';
import Torii from 'ember-simple-auth/authenticators/torii';
import config from '../config/environment';

export default class ToriiGithubAuthenticator extends Torii {
  @service torii;
  @service ajax;

  async authenticate() {
    const tokenExchangeUri = config.torii.providers['github-oauth2'].tokenExchangeUri;
    let data = await super.authenticate(...arguments);
    const rd = await this.ajax.request(tokenExchangeUri, {
      // Adding method type
      method: "POST",
      // Adding body or contents to send
      data: {
        code: data.authorizationCode
      }
    });

    return {
      access_token: rd.access_token,
      provider: 'github',
      email: rd.user.email,
      id: rd.user.id
    };
  }
}
