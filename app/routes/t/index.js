import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  model() {
    const i18n = this.get('i18n');

    return hash({
      records: this.get('store').query('t', {
      }),
      columns: [
        {
          propertyName: 's',
          title: 'Texto',
          className: 'mt-s-id'
        },
        {
          propertyName: 't',
          filteredBy: 't_contains',
          title: i18n.t('form-t-t'),
          className: 'mt-c-t text-cell'
        },
        {
          propertyName: 'l',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('t.l')
        },
        {
          propertyName: 'isChanged',
          filteredBy: 'isChanged',
          title: 'Alterado?',
          className: 'mt-c-isChanged'
        },
        {
          propertyName: 'published',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('form-content-published'),
          className: 'mt-c-published'
        },
        {
          propertyName: 'updatedAt',
          filteredBy: 'updatedAt',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('form-t-updatedAt'),
          component: 'mt-list-item-dates',
          className: 'mt-c-updatedAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-t'
        }
      ]
    });
  }
});
