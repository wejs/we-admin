import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  model() {
    const i18n = this.get('i18n');

    return  hash({
      records: this.get('store').query('sitecontact', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID'
        },
        {
          propertyName: 'name',
          filteredBy: 'name',
          title: "Nome"
        },
        {
          propertyName: 'email',
          filteredBy: 'email',
          title: "Email"
        },

        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: 'Enviado em',
          component: 'mt-list-item-created-at'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-site-contacts'
        }
      ]
    });
  }
});
