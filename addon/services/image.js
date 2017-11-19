import Ember from 'ember';

let ENV;

export default Ember.Service.extend({
  init(){
    this._super(...arguments);

    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
  },
  getImageData(imageId) {
    let headers = { Accept: 'application/json' },
        accessToken = this.get('session.session.authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return Ember.$.ajax({
      url: `${ENV.API_HOST}/api/v1/image/${imageId}/data`,
      type: 'GET',
      headers: headers
    })
    .then((data) => {
      if (data && data.image) {
        return Ember.A([data.image]);
      } else {
        return null;
      }
    });
  }
});

