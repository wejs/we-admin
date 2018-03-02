import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model() {
    return  Ember.RSVP.hash({
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
