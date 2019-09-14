import Ember from 'ember';
import Component from '@ember/component';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';

/**
 *  {{field-model-selector
      selected=object
      modelName="content"
      filterParam="title"
    }}
 */

export default Component.extend({
  store: inject('store'),
  classNames: ['field-model-selector'],
  selected: null,

  modelName: null,
  filterParam: null,
  displayValue: null,

  init() {
    this._super(...arguments);
    this.set('ENV', getOwner(this).resolveRegistration('config:environment'));
  },

  actions: {
    onSearch(term) {
      return this.search(term);
    }
  },

  search(term) {
    const modelName = this.get('modelName');
    if (!modelName) {
      Ember.Logger.warn('component:field-model-selector:modelName not set or is null');
      return;
    }

    const filterParam = this.get('filterParam');
    if (!filterParam) {
      Ember.Logger.warn('component:field-model-selector:filterParam not set or is null');
      return;
    }

    const q = {
      limit: 10,
      order: 'createdAt DESC'
    };

    if (term) {
      q[filterParam + '_contains'] = term;
      q.order = filterParam+' ASC';
    }

    return this.get('store')
    .query(modelName, q)
    .then( (records)=> {
      return records;
    })
    .catch( (err)=> {
      this.sendAction('queryError', err);
      return null;
    });
  }
});