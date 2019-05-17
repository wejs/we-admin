import { inject } from '@ember/service';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { isPresent } from '@ember/utils';
import { getOwner } from '@ember/application';
import { get } from '@ember/object';

import Inflector from 'ember-inflector';
const inflector = Inflector.inflector;
inflector.irregular('modelsterms', 'modelsterm');

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  session: inject(),

  init() {
    this._super(...arguments);

    this.set('headers', {
      'Accept': 'application/vnd.api+json'
    });

    const ENV = getOwner(this).resolveRegistration('config:environment');

    this.set('host', ENV.API_HOST);
  },

  /**
    @method pathForType
    @param {String} modelName
    @return {String} path
  **/
  pathForType(modelName) {
    return modelName;
  },

  authorize(xhr) {
    let token = this.get('session.token');
    if (this.get('session.isAuthenticated') && isPresent(token)) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  },

  urlForQuery (query) {
    if (!query.vocabularyName) {
      // default vocabulary name:
      query.vocabularyName = 'Tags';
    }
    return `${this.get('host')}/vocabulary/${encodeURIComponent(query.vocabularyName)}/term`;
  },
  urlForFindRecord(id, modelName, snapshot) {
    let vocabularyName = (
      get(snapshot.record, 'vocabularyName') ||
      get(snapshot.adapterOptions, 'vocabularyName') ||
      'Tags'
    );

    return `${this.get('host')}/vocabulary/${vocabularyName}/term/${id}`;
  },
  urlForCreateRecord(modelName, snapshot) {
    let vocabularyName = (
      get(snapshot.record, 'vocabularyName') ||
      get(snapshot.adapterOptions, 'vocabularyName') ||
      'Tags'
    );

    return `${this.get('host')}/vocabulary/${vocabularyName}/term`;
  },
  urlForUpdateRecord(id, modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${get(snapshot.record, 'vocabularyName')}/term/${id}`;
  },
  urlForDeleteRecord(id, modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${get(snapshot, 'record.vocabularyName')}/term/${id}`;
  }
});