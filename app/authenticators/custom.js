import Base from 'ember-simple-auth/authenticators/base';
import { inject } from '@ember/service';
import { Promise } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';

export default Base.extend({
  ajax: inject(),

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
  },
  authenticate(email, password, data) {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    if (data) {
      return new Promise( (resolve) => {
        resolve({ id: data, email: email });
      });
    }

    return this.get('ajax').post(ENV.API_HOST + '/login', {
      data: {
        email: email,
        password: password
      }
    }).
    then( (r)=> {
      if (r && r.user && r.user.id) {
        return { email: email, id: r.user.id };
      } else {
        return { email: email };
      }
    });
  },

  invalidate() {
    const ENV = getOwner(this).resolveRegistration('config:environment');
    return this.get('ajax').request(ENV.API_HOST + '/auth/logout');
  }
});