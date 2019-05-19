import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const i18n = this.get('i18n');

    return  hash({
      records: this.get('store').query('url-alia', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID'
        },
        {
          propertyName: 'alias',
          filteredBy: 'alias_contains',
          title: i18n.t('form-urlAlias-alias')
        },
        {
          propertyName: 'target',
          filteredBy: 'target_contains',
          title: i18n.t('form-urlAlias-target')
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: i18n.t('form-urlAlias-createdAt'),
          component: 'mt-list-item-created-at'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-url-alia'
        }
      ]
    });
  }
});
