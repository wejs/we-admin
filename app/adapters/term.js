import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import Inflector from 'ember-inflector';
const inflector = Inflector.inflector;
inflector.irregular('modelsterms', 'modelsterm');

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:custom',
  headers: {
    'Accept': 'application/vnd.api+json'
  },
  init() {
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

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
  urlForQuery (query) {
    if (!query.vocabularyName) {
      // default vocabulary name:
      query.vocabularyName = 'Tags';
    }
    return `${this.get('host')}/vocabulary/${encodeURIComponent(query.vocabularyName)}/term`;
  },
  urlForFindRecord(id, modelName, snapshot) {
    let vocabularyName = (
      Ember.get(snapshot.record, 'vocabularyName') ||
      Ember.get(snapshot.adapterOptions, 'vocabularyName') ||
      'Tags'
    );

    return `${this.get('host')}/vocabulary/${vocabularyName}/term/${id}`;
  },
  urlForCreateRecord(modelName, snapshot) {
    let vocabularyName = (
      Ember.get(snapshot.record, 'vocabularyName') ||
      Ember.get(snapshot.adapterOptions, 'vocabularyName') ||
      'Tags'
    );

    return `${this.get('host')}/vocabulary/${vocabularyName}/term`;
  },
  urlForUpdateRecord(id, modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${Ember.get(snapshot.record, 'vocabularyName')}/term/${id}`;
  },
  urlForDeleteRecord(id, modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${Ember.get(snapshot, 'record.vocabularyName')}/term/${id}`;
  }
});