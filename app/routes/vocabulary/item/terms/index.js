import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import { get, set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  term: inject(),

  model() {
    const vocabulary = this.modelFor('vocabulary.item').record;
    const i18n = this.get('i18n');

    return  hash({
      vocabulary: vocabulary,
      records: this.get('store').query('term', {
        vocabularyName: get(vocabulary,'name')
      }),
      columns: [
        {
          propertyName: 'id',
          title: 'ID',
          className: 'mt-c-id'
        },
        {
          propertyName: 'text',
          filteredBy: 'text_starts-with',
          title: i18n.t('form-term-text'),
          className: 'mt-c-text text-cell'
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: i18n.t('form-term-createdAt'),
          component: 'mt-list-item-created-at',
          className: 'mt-c-createdAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title:  i18n.t('Actions'),
          component: 'mt-actions-vocabulary-terms',
          template: 'vocabulary/item/terms/list-item-actions'
        }
      ]
    });
  },

  afterModel(model) {
    if (model.records && get(model.records, 'length') ) {
      const length = get(model.records, 'length');
      for (let i = 0; i < length; i++) {
        const record = model.records.objectAt(i);
        set(record, 'vocabulary', model.vocabulary);
      }
    }
  },
  actions: {
    deleteRecord(record) {
      const vocabulary = this.modelFor('vocabulary.item').record;

      if (confirm(`Tem certeza que deseja deletar o termo "${record.get('text')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`O termo "${record.get('text')}" foi deletado.`);
          this.transitionTo('vocabulary.item.terms.index', vocabulary.id);
          return null;
        });
      }
    }
  }
});