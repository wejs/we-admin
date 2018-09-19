import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return  hash({
      users: this.get('store').query('user', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID'
        },
        {
          propertyName: 'displayName',
          filteredBy: 'displayName_starts-with',
          title: 'Nome'
        },
        {
          propertyName: 'email',
          filteredBy: 'email_starts-with',
          title: 'E-mail'
        },
        {
          propertyName: 'fullName',
          filteredBy: 'fullName_starts-with',
          title: 'Nome completo'
        },
        {
          propertyName: 'active',
          disableSorting: true,
          disableFiltering: true,
          title: 'Active'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: 'Actions',
          component: 'mt-actions-users'
        }
      ]
    });
  }
});
