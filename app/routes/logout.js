import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),
  afterModel: function() {
    this.get('session').invalidate();

    document.cookie = 'wejs.sid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
});