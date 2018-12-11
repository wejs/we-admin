import Ember from 'ember';
import { inject } from '@ember/service';

let ENV;

export default Ember.Component.extend({
  notifications: inject('notification-messages'),
  upload: inject(),

  init() {
    this._super(...arguments);
    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('url', `${ENV.API_HOST}/api/v1/image`);
  },

  willInsertElement() {
    this._super(...arguments);
    this.get('upload').initUploadMecanism();
  },

  isLOading: false,
  url: null, // upload url

  multiple: false,

  value: Ember.A([]),

  canAddMore: Ember.computed('value.length', 'multiple', function() {
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

  canSelectMore: Ember.computed(
    'upload.imagesToUpload.length',
    'multiple',
  function() {
    const isMultiple = this.get('multiple');

    if (isMultiple) {
      return true;
    }

    if (this.get('upload.imagesToUpload.length')) {
      return false;
    }

    return true;
  }),

  fileToShow: Ember.computed('value', function() {
    const value = this.get('value');
    if (Ember.isArray(value)) {
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
      this.set('value', Ember.A([]));
      return this.get('value');
    }
  },

  actions: {
    removeImage(image) {
      if (confirm(`Tem certeza que deseja remover essa imagem?`)) {
        const value = this.getValue();
        value.removeObject(image);
        this.set('uploaderOld', null);
        this.set('selectedFile', null);
      }
    },
    upload() {
      this.set('isLOading', true);

      this.get('upload')
      .uploadImages()
      .then( (results)=> {
        const value = this.getValue();

        results.forEach( (image)=> {
          value.pushObject(image);
        });

        this.set('isLOading', false);
        this.hideUploadModal();
      })
      .catch( (err)=> {
        this.get('notifications').error('Erro ao enviar a imagem para o servidor, tente novamente mais tarde');
        Ember.Logger.error(err);
        this.set('isLOading', false);
      });
    },

    openImageUploader() {
      this.set('error', null);
      this.set('uploadingImage', true);
    },

    onHideUploadModal() {
      this.hideUploadModal();
    },

    /**
     * Select one salved image:
     */
    onSelectSalvedImage(image) {
      const value = this.getValue();
      value.pushObject(image);
      this.hideUploadModal();
      this.set('uploaderOld', null);
      this.set('description', null);
      this.set('selectedFile', null);
    }
  },

  selected(files) {
    const file = files[0];
    this.set('selectedFile', file);
    const reader = new FileReader();

    reader.onload = (e)=> {
      // get local file src
      this.set('previewImageSrc', e.target.result);

      let fileSizeInMB = Math.round(file.size/1024/1024);

      if (fileSizeInMB >= 10) {

        this.get('notifications').error('A imagem selecionada tem '+fileSizeInMB+'MB'+
          ' e o limite de envio de imagens é 10MB. Selecione uma imagem com menos de 10MB de tamanho.');
        this.hideUploadModal();
      }
    };
    reader.readAsDataURL(file);
  },

  hideUploadModal() {
    if (this.get('uploadingImage')) {
      this.set('uploadingImage', false);
    }

    this.set('error', null);
    this.set('uploaderOld', null);
    this.set('selectedFile', null);
    this.set('description', null);
    this.set('uploadingImage', false);
  }
});
