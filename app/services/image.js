import Ember from 'ember';

export default Ember.Service.extend({
  settings: Ember.inject.service(),

  getImageData(imageId) {
    const settings = this.get('settings');

    return Ember.$.ajax({
      url: `${settings.ENV.API_HOST}/api/v1/image/${imageId}/data`,
      type: 'GET',
      headers: settings.getHeaders()
    })
    .then((data) => {
      if (data && data.image) {
        return Ember.A([data.image]);
      } else {
        return null;
      }
    });
  },

  getLastUserImages() {
    const settings = this.get('settings');

    return Ember.$.ajax({
      url: `${settings.ENV.API_HOST}/api/v1/image?selector=owner`,
      type: 'GET',
      headers: settings.getHeaders()
    })
    .then( (data) => {
      if (data && data.image) {
        return Ember.A(data.image);
      } else {
        return null;
      }
    });
  }
});

