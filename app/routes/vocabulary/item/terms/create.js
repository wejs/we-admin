import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const vocabulary = this.modelFor('vocabulary.item').record;
    return {
      vocabulary: vocabulary,
      record: this.store.createRecord('term', {
        vocabularyName: get(vocabulary,'name')
      })
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('O termo foi criado com sucesso.');

        this.transitionTo(
          'vocabulary.item.terms.index',
          this.get('currentModel.vocabulary.id')
        );
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});