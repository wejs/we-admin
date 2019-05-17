import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  settings: inject('settings'),
  upload: inject('upload'),

  settingsLoaded: alias('settings.loaded'),
  appName: alias('settings.data.appName'),
  appLogo: alias('settings.data.appLogo'),
  fileSelectorModalOpen: alias('upload.modalOpen'),

  actions: {
    // UPLOAD ACTIONS:
    upload() {
      this.get('upload').uploadForTextEditor();
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

    onSelectSalvedImage(image) {
      this.get('upload').onSelectSalvedImage(image);
    },
  }
});