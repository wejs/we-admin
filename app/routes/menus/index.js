import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const i18n = this.get('i18n');

    return  hash({
      records: this.get('store').query('menu', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID'
        },
        {
          propertyName: 'name',
          filteredBy: 'name_starts-with',
          title: i18n.t('form-menu-name')
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: i18n.t('form-menu-createdAt'),
          component: 'mt-list-item-created-at'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-menus'
        }
      ]
    });
  },

  afterModel(model) {
    const menus = get(model, 'records');
    if (get(menus, 'length')) {
      this.transitionTo('/menus/'+ menus.get('firstObject.id'));
    } else {
      this.transitionTo('/menus/create');
    }
  }
});
