import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject } from '@ember/service';

export default Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  model() {
    const i18n = this.get('i18n');

    return  hash({
      records: this.get('store').query('image', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID',
          className: 'content-id mt-c-id'
        },
        {
          propertyName: 'originalname',
          filteredBy: 'originalname_contains',
          className: 'content-description text-cell',
          title: 'Nome original'
        },
        {
          propertyName: 'description',
          filteredBy: 'description_contains',
          className: 'content-description text-cell',
          title: 'Descrição'
        },
        {
          propertyName: 'metadata',
          className: 'content-description text-cell',
          title: 'Metadata',
          disableSorting: true,
          disableFiltering: true,
          component: 'mt-media-image-metadata'
        },
        {
          propertyName: 'urls',
          className: 'content-description text-cell',
          title: 'URLs',
          disableSorting: true,
          disableFiltering: true,
          component: 'mt-media-image-urls'
        },
        {
          propertyName: 'createdAt',
          className: 'content-createdAt',
          filteredBy: 'createdAt',
          disableSorting: false,
          disableFiltering: true,
          title: i18n.t('form-content-createdAt'),
          component: 'mt-list-item-created-at'
        },
        // {
        //   propertyName: 'actions',
        //   className: 'content-actions',
        //   disableSorting: true,
        //   disableFiltering: true,
        //   title: i18n.t('Actions'),
        //   component: 'mt-actions-media-image'
        // }
      ]
    });
  }
});
