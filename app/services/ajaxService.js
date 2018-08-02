import Ember from 'ember';

let ENV;

import AjaxService from 'ember-ajax/services/ajax';
import { UnauthorizedError } from 'ember-ajax/errors';

window.$.ajaxSetup({
  accepts: {
    json: 'application/vnd.api+json'
  },
  headers: {
    "Accept": "application/vnd.api+json"
  }
});

export default AjaxService.extend({
  session: Ember.inject.service(),
  host: ENV.API_HOST,

  init(){
    this._super(...arguments);

    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
  },

  request(url, options) {
    this.get('session').authorize('authorizer:custom', (headers) => {
      this.set('headers', headers);
    });

    return this._super(url, options)
    .catch( (error) => {
      if (error instanceof UnauthorizedError) {
        if (this.get('session.isAuthenticated')) {
          this.get('session').invalidate();
        }
      }
      else {
        throw error;
      }
    });
  }
});