import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get, set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    const vocabulary = this.modelFor('vocabulary.item').record;

    return hash({
      vocabulary: vocabulary,
      record: this.get('store').findRecord('term', (params.termId || params.id), {
        adapterOptions: {
          vocabularyName: get(vocabulary, 'name')
        }
      }),
      alias: null
    });
  },
  afterModel(model) {
    if (model.record && model.record.id && model.vocabulary) {
      set(model.record, 'vocabulary', model.vocabulary);
    }

    const linkPermanent = get(model.record, 'linkPermanent');

    if (linkPermanent) {
      model.alias = this.get('store').query('url-alia', {
        target: linkPermanent,
        limit: 1,
        order: 'id DESC'
      })
      .then( (r)=> { // get only one alias:
        if (r && r.objectAt && r.objectAt(0)) {
          model.alias = r.objectAt(0);
        } else {
          model.alias = this.get('store')
          .createRecord('url-alia', {
            target: linkPermanent,
            alias: linkPermanent
          });
        }
      });

      return model.alias;
    }
  },
  actions: {
    save(record, alias) {
      record.save()
      .then( function saveAlias(content) {
        if (!alias) {
          return content;
        }

        set(alias, 'alias', record.setAlias);

        return content;
      })
      .then( (r)=> {
        this.get('notifications').success('O termo foi salvo.');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});