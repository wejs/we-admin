import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      records: this.get('store').query('comment', {}),
      columns: [
        // {
        //   propertyName: 'id',
        //   title: 'ID',
        //   className: 'mt-c-id'
        // },
        {
          propertyName: 'creator',
          filteredBy: 'creatorId_starts-with',
          title: 'Autor',
          className: 'mt-c-creator text-cell',
          component: 'mt-creator'
        },
        {
          propertyName: 'body',
          filteredBy: 'body_contains',
          title: 'Comentário',
          className: 'mt-c-body text-cell',
          component: 'mt-comment-body'
        },
        {
          propertyName: 'modelId',
          filteredBy: 'modelId',
          title: 'Em resposta para',
          component: 'mt-comment-in-repply-to',
          className: 'mt-c-body text-cell'
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: 'Enviado em',
          component: 'mt-list-item-created-at',
          className: 'mt-c-createdAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: 'Ações',
          component: 'mt-actions-comment'
        }
      ]
    });
  }
});
