import Ember from 'ember';

let ENV;

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),

  init() {
    this._super(...arguments);

    ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('url', `${ENV.API_HOST}/api/v1/image`);
  },

  isLOading: false,
  url: null,
  uploader: null,

  multiple: false,

  percent: 0,
  value: Ember.A([]),
  selectedFile: null,
  previewImageSrc: null,

  notReadyToUpload: true,
  error: null,

  uploadingImage: false,
  description: null,

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
    startUpload() {},
    selected(files) {
      this.selected(files);
    },
    progress(uploader, e) {
      this.set('percent', e.percent);
    },
    didUpload(uploader, e) {
      const value = this.getValue();
      value.pushObject(e.image);

      this.set('uploader', null);
      this.set('description', null);
      this.set('selectedFile', null);
    },
    didError(uploader, jqXHR, textStatus, errorThrown) {
      console.log('didError>', uploader, jqXHR, textStatus, errorThrown);
    },
    removeImage(image) {
      if (confirm(`Tem certeza que deseja remover essa imagem?`)) {
        const value = this.getValue();
        value.removeObject(image);
        this.set('uploader', null);
        this.set('selectedFile', null);
      }
    },
    upload() {
      this.get('uploader')
      .upload(this.get('selectedFile'), {
        description: (this.get('description') || '')
      })
      .then( (r)=> {
        this.set('uploader', null);
        this.set('selectedFile', null);
        this.set('uploadingImage', false);
        return r;
      })
      .catch( (err)=> {
        console.log('erro no upload', err);
      });
    },

    openImageUploader() {
      this.set('notReadyToUpload', true);
      this.set('error', null);
      this.set('uploadingImage', true);
    },

    onHideUploadModal() {
      this.hideUploadModal();
    },

    onSelectSalvedImage(image) {
      const value = this.getValue();
      value.pushObject(image);
      this.hideUploadModal();
      this.set('uploader', null);
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
      } else {
        this.set('notReadyToUpload', false);
      }
    };
    reader.readAsDataURL(file);
  },

  hideUploadModal() {
    if (this.get('uploadingImage')) {
      this.set('uploadingImage', false);
    }

    this.set('notReadyToUpload', true);
    this.set('error', null);
    this.set('uploader', null);
    this.set('selectedFile', null);
    this.set('description', null);
    this.set('uploadingImage', false);
  }
});
