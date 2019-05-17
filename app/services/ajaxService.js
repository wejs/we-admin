import { inject } from '@ember/service';
import { getOwner } from '@ember/application';

let ENV;

import AjaxService from 'ember-ajax/services/ajax';
import { UnauthorizedError } from 'ember-ajax/errors';

window.$.ajaxSetup({
  accepts: {
    json: 'application/vnd.api+json'
  },
  headers: {
    'Accept': 'application/vnd.api+json'
  },
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});

export default AjaxService.extend({
  settings: inject(),
  host: ENV.API_HOST,

  init() {
    this._super(...arguments);

    ENV = getOwner(this).resolveRegistration('config:environment');
  },

  request(url, options) {
    this.set('headers', this.get('settings').getHeaders());

    return this._super(url, options)
    .catch( (error) => {
      if (error instanceof UnauthorizedError) {
        if (this.get('session.isAuthenticated')) {
          this.get('session').invalidate();
        }
      } else {
        throw error;
      }
    });
  }
});