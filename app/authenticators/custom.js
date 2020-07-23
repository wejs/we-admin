// import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';
//
// export default class OAuth2Authenticator extends OAuth2PasswordGrant {}

import Base from 'ember-simple-auth/authenticators/base';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';

export default class CustomAuthenticator extends Base {
  @service ajax;
  @service settings;

  restore(data) {
    return new Promise( (resolve, reject) => {
      if (
        !isEmpty(get(data, 'email')) ||
        !isEmpty(get(data, 'id'))
      ) {
        resolve(data);
      } else {
        reject();
      }
    });
  }

  authenticate(email, password, data) {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    if (data) {
      return new Promise( (resolve) => {
        resolve({ id: data, email: email });
      });
    }

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const headers = this.settings.getHeaders();
    headers.Accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    return fetch(ENV.API_HOST + '/auth/grant-password/authenticate', {
      method: 'POST',
      headers,
      // credentials: 'include',
      body: JSON.stringify({
        grant_type: 'password',
        email: email,
        password: password
      })
    })
    .then(async (response)=> {
      const data = await response.json();

      if (!response.ok) {
        response.responseJSON = data;
        throw response;
      }

      return data;
    })
    .then(function(data) {
      return data;
    })
    .then( (r)=> {
      if (!r.user) {
        return false;
      }

      if (r && r.user && r.user.id) {
        return {
          access_token: r.access_token,
          refresh_token: r.refresh_token,
          email: email,
          id: r.user.id
        };
      } else {
        return {
          access_token: r.access_token,
          refresh_token: r.refresh_token,
          email: email
        };
      }
    });
  }

  invalidate() {
    const ENV = getOwner(this).resolveRegistration('config:environment');
    return fetch(ENV.API_HOST + '/auth/logout', {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
  }
}
