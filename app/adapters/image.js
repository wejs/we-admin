import { inject } from '@ember/service';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { isPresent } from '@ember/utils';
import { getOwner } from '@ember/application';

export default DS.JSONAPIAdapter.extend(
DataAdapterMixin, {
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

  /**
   * Find all / list of images
   * @param  {Object} query
   * @return {String}
   */
  urlForQuery () {
    return `${this.get('host')}/api/v2/image`;
  },

  /**
   * Find one image record
   *
   * @param  {String|Number} id
   * @param  {String} modelName
   * @param  {Object} snapshot
   * @return {String}
   */
  urlForFindRecord(id) {
    return `${this.get('host')}/api/v2/image/${id}`;
  },
  // urlForCreateRecord(modelName, snapshot) {
  //   let vocabularyName = (
  //     Ember.get(snapshot.record, 'vocabularyName') ||
  //     Ember.get(snapshot.adapterOptions, 'vocabularyName') ||
  //     'Tags'
  //   );

  //   return `${this.get('host')}/vocabulary/${vocabularyName}/term`;
  // },

  // urlForUpdateRecord(id, modelName, snapshot) {
  //   return `${this.get('host')}/vocabulary/${Ember.get(snapshot.record, 'vocabularyName')}/term/${id}`;
  // },
  // urlForDeleteRecord(id, modelName, snapshot) {
  //   return `${this.get('host')}/vocabulary/${Ember.get(snapshot, 'record.vocabularyName')}/term/${id}`;
  // },

  namespace: 'api/v1'
});