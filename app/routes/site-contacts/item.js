import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  term: inject(),
  model(params) {
    return hash({
      record: this.get('store').findRecord('sitecontact', params.id),
    });
  }
});