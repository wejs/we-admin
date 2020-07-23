// import { inject } from '@ember/service';
// import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
// import { isPresent } from '@ember/utils';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
// import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
// import fetch from 'fetch';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;
  @service settings;

  @computed('session.{data.authenticated.access_token,isAuthenticated}')
  get headers() {
    return this.settings.getHeaders();
  }

  get host() {
    const ENV = getOwner(this).resolveRegistration('config:environment');
    return ENV.API_HOST;
  }

  /**
    @method pathForType
    @param {String} modelName
    @return {String} path
  **/
  pathForType(modelName) {
    return modelName;
  }

  // _fetchRequest(options) {
  //   console.log('TODO!!!!');
  //
  //   // TODO! change to only set includ if is in dev env, in prod set: 'same-origin'
  //   options.credentials = 'include';
  //   return fetch(options.url, options);
  // }

  /**
    This method is called for every response that the adapter receives from the
    API. If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).
    @method handleResponse
    @param {Number} status The response status as received from the API
    @param  {Object} headers HTTP headers as received from the API
    @param {Any} payload The response body as received from the API
    @param {Object} requestData the original request information
    @protected
  */
  handleResponse(status, headers, payload, requestData) {
    this.ensureResponseAuthorized(status, headers, payload, requestData);
    return super.handleResponse(...arguments);
  }

  /**
   The default implementation for handleResponse.
   If the response has a 401 status code it invalidates the session (see
    {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}}).
   Override this method if you want custom invalidation logic for incoming responses.
   @method ensureResponseAuthorized
   @param {Number} status The response status as received from the API
   @param  {Object} headers HTTP headers as received from the API
   @param {Any} payload The response body as received from the API
   @param {Object} requestData the original request information
  */
  ensureResponseAuthorized(status/* ,headers, payload, requestData */) {
    if (status === 401 && this.session.isAuthenticated) {
      this.session.invalidate();
    }
  }

}
