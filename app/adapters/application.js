import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

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
  }
});
