import Ember from 'ember';
import { inject } from '@ember/service';
import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';

let ENV;

export default Component.extend({
  notifications: inject('notification-messages'),
  upload: inject(),

  init () {
    this._super(...arguments);
    ENV = getOwner(this).resolveRegistration('config:environment');
    this.set('url', `${ENV.API_HOST}/api/v1/file`);
  },

  willInsertElement() {
    this._super(...arguments);
    this.get('upload').initUploadMecanism();
  },

  isLOading: false,
  url: null,

  multiple: false,

  value: A(),

  canAddMore: computed('value.length', 'multiple', function() {
    const isMultiple = this.get('multiple');

    if (
      // multiple:
      isMultiple ||
      // single and empty:
      !isMultiple && !this.get('value.length')
    ) {
      return true;
    } else {
      return false;
    }
  }),

  canSelectMore: computed(
    'upload.filesToUpload.length',
    'multiple',
  function() {
    const isMultiple = this.get('multiple');

    if (isMultiple) {
      return true;
    }

    if (this.get('upload.filesToUpload.length')) {
      return false;
    }

    return true;
  }),


  fileToShow: computed('value', function() {
    const value = this.get('value');
    if (isArray(value)) {
      return value[0];
    } else {
      return null;
    }
  }),

  getValue() {
    let value = this.get('value');
    if (value) {
      return value;
    } else {
      this.set('value', A());
      return this.get('value');
    }
  },

  actions: {
    removeFile(file) {
      if (confirm(`Tem certeza que deseja remover esse arquivo?`)) {
        const value = this.getValue();
        value.removeObject(file);
        this.set('uploader', null);
        this.set('selectedFile', null);
      }
    },
    upload() {
      this.set('isLOading', true);

      this.get('upload')
      .uploadFiles()
      .then( (results)=> {
        const value = this.getValue();

        results.forEach( (file)=> {
          value.pushObject(file);
        });

        this.set('isLOading', false);
        this.hideUploadModal();
      })
      .catch( (err)=> {
        this.get('notifications').error('Erro ao enviar o arquivo para o servidor, tente novamente mais tarde');
        Ember.Logger.error(err);
        this.set('isLOading', false);
      });
    },

    openFileUploader() {
      this.set('error', null);
      this.set('uploadingFile', true);
    },

    onHideUploadModal() {
      this.hideUploadModal();
    }
  },

  hideUploadModal() {
    this.set('uploadingFile', false);
    this.get('upload').cancel();
  }
});
