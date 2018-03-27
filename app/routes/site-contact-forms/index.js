import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {

    return  Ember.RSVP.hash({
      records: this.get('store').query('sitecontact-form', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID',
          className: 'mt-c-id'
        },
        {
          propertyName: 'subject',
          filteredBy: 'subject',
          title: 'Asunto',
          className: 'mt-c-subject text-cell'
        },
        {
          propertyName: 'publishedAt',
          filteredBy: 'publishedAt',
          title: 'Publicado em',
          component: 'mt-list-item-created-at',
          className: 'mt-c-createdAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: 'Ações',
          component: 'mt-actions-sitecontact-form'
        }
      ]
    });
  }
});
