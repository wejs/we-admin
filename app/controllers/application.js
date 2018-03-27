import Ember from 'ember';

export default Ember.Controller.extend({
  settings: Ember.inject.service('settings'),
  upload: Ember.inject.service('upload'),

  settingsLoaded: Ember.computed.alias('settings.loaded'),
  appName: Ember.computed.alias('settings.data.appName'),
  appLogo: Ember.computed.alias('settings.data.appLogo'),
  fileSelectorModalOpen: Ember.computed.alias('upload.modalOpen'),

  actions: {
    // UPLOAD ACTIONS:
    upload() {
      this.get('upload').upload();
    },

    selected() {
      this.get('upload').selected(...arguments);
    },

    onHideUploadModal() {
      this.get('upload').onHideUploadModal();
    },

    progress(uploader, e) {
      this.get('upload').progress(uploader, e);
    },
    didUpload(uploader, e) {
      this.get('upload').didUpload(uploader, e);
    },
    didError(uploader, jqXHR, textStatus, errorThrown) {
      this.get('upload').didError(uploader, jqXHR, textStatus, errorThrown);
    },
  }
});