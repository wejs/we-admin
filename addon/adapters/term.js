import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  init(){
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('host', ENV.API_HOST);
  },
  authorizer: 'authorizer:custom',
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

    return `${this.get('host')}/vocabulary/${query.vocabularyName}/term`;
  },
  urlForCreateRecord(modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${Ember.get(snapshot.record, 'vocabularyName')}/term`;
  },
  urlForDeleteRecord(id, modelName, snapshot) {
    return `${this.get('host')}/vocabulary/${Ember.get(snapshot, 'record.vocabularyName')}/term/${id}`;
  }
});