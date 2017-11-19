import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  ajax: Ember.inject.service(),

  restore(data) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (
        !Ember.isEmpty(Ember.get(data, 'email')) ||
        !Ember.isEmpty(Ember.get(data, 'id'))
      ) {
        resolve(data);
      } else {
        reject();
      }
    });
  },
  authenticate(email, password, data) {
    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    if (data) {
      return new Ember.RSVP.Promise((resolve) => {
        resolve({ id: data, email: email });
      });
    }

    return this.get('ajax').post(ENV.API_HOST + '/login', {
      data: {
        email: email,
        password: password
      }
    }).
    then( ()=> {
      return { email: email };
    });
  },

  invalidate() {
    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    return this.get('ajax').request(ENV.API_HOST + '/auth/logout');
  }
});