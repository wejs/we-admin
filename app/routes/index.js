import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  ajax: inject(),

  model() {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    return hash({
      contentCount: this.get('ajax')
        .request(`${ENV.API_HOST}/content/count`)
        .then((json) => json.count ),
      unPublishedContents: this.get('store').query('content', {
        published: false
      }),
      newUsers: this.get('ajax')
        .request(`${ENV.API_HOST}/user?limit=10`)
        .then((json) => json ),
    });
  }
});