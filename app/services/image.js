import { inject } from '@ember/service';
import Service from '@ember/service';
import $ from 'jquery';
import { A } from '@ember/array';

export default Service.extend({
  settings: inject(),

  getImageData(imageId) {
    const settings = this.get('settings');

    return $.ajax({
      url: `${settings.ENV.API_HOST}/api/v1/image/${imageId}/data`,
      type: 'GET',
      headers: settings.getHeaders()
    })
    .then((data) => {
      if (data && data.image) {
        return A([data.image]);
      } else {
        return null;
      }
    });
  },

  getLastUserImages() {
    const settings = this.get('settings');

    return $.ajax({
      url: `${settings.ENV.API_HOST}/api/v1/image?selector=owner`,
      type: 'GET',
      headers: settings.getHeaders()
    })
    .then( (data) => {
      if (data && data.image) {
        return A(data.image);
      } else {
        return null;
      }
    });
  }
});

