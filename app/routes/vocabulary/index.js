import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const i18n = this.get('i18n');

    return  hash({
      records: this.get('store').query('vocabulary', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID'
        },
        {
          propertyName: 'name',
          filteredBy: 'name_starts-with',
          title: i18n.t('form-vocabulary-name')
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: i18n.t('form-vocabulary-createdAt'),
          component: 'mt-list-item-created-at'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-vocabulary'
        }
      ]
    });
  }
});