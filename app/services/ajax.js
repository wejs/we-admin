import Service from '@ember/service';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class AjaxService extends Service {
  @service settings;
  @service notifications;

  request(url, options = {}) {
    if (!options.headers) {
      options.headers = this.settings.getHeaders();
    }

    options.credentials = 'include';
    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';

    return fetch(url, options)
    .then(async (response)=> {
      const data = await response.json();

      if (!options.disableAPIMessageHanling) {
        if (!response.ok) {
          this.settings.queryError(data);
        } else {
          this.handleResponseNotification(response);
        }
      }

      return data;
    })
    .then(function(data) {
      return data;
    })
    .catch( (error) => {
      throw error;
    });
  }

  handleResponseNotification(response) {
    if (
      response.meta &&
      response.meta.messages
    ) {
      response.meta.messages.forEach( (e)=> {
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
