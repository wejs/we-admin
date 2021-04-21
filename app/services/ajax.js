import Service from '@ember/service';
import { inject as service } from '@ember/service';
import AjaxServiceBase from 'ember-ajax/services/ajax';
import { getOwner } from '@ember/application';
import {
  /* isAjaxError,
  isNotFoundError, */
  isForbiddenError
} from 'ember-ajax/errors';

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

export default class AjaxService extends AjaxServiceBase {
  @service settings;
  @service notifications;

  get host() {
    return this.ENV.API_HOST;
  }

  constructor() {
    super(...arguments);

    this._parentRequest = super.request;
    this.ENV = getOwner(this).resolveRegistration('config:environment');
  }

  _shouldSendHeaders() {
    return true;
  }

  request(url, options = {}) {
    if (!url) {
      throw new Error('Url is required to service ajax.request method');
    }

    if (!options.headers) {
      options.headers = this.settings.getHeaders();
    }

    const ENV = getOwner(this).resolveRegistration('config:environment');

    let resolvedUrl = url;

    if (url[0] == '/' ) {
      resolvedUrl = ENV.API_HOST + resolvedUrl;
    }

    if (ENV.authenticateWithToken) {
      options.credentials = 'include';
    }

    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';

    const xhrPromisse = this._parentRequest(resolvedUrl, options)
    .then((data) => {
      if (!options.disableAPIMessageHanling) {
        this.handleResponseNotification(data);
      }

      return data;
    })
    .catch((error) => {
      const { payload } = error;

      if (isForbiddenError(error)) {
        if (this.get('session.isAuthenticated')) {
          return this.get('session').invalidate();
        }
      }

      this.settings.queryError(payload);
    });

    return xhrPromisse;
  }

  handleResponseNotification(data) {
    if (
      data.meta &&
      data.meta.messages
    ) {
      data.meta.messages.forEach( (e)=> {
        switch(e.status) {
          case 'warning':
            this.notifications.warning(e.message);
            break;
          case 'success':
            this.notifications.success(e.message);
            break;
          case 'error':
            this.notifications.success(e.message);
            break;
          default:
            this.notifications.info(e.message);
        }
      });
    }
  }
}