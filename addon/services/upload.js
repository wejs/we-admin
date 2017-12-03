import Ember from 'ember';

const set = Ember.set;
let ENV;

export default Ember.Service.extend({
  modalOpen: Ember.computed.alias('fileSelectedCallback'),

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
  selectedFile: null,
  previewImageSrc: null,

  notReadyToUpload: true,
  error: null,

  uploadingImage: false,
  description: null,

  fileSelectedCallback: null,

  startUpload() {},

  get_file_picker_callback() {
    const uploadService = this;

    return function(cb, value, meta) {
      if (meta.filetype === 'image') {
        uploadService.openImageSelector(value, meta, (err, fileData)=> {
          if (err || !fileData || !fileData.image) {
            cb();
            return null;
          }

          let fileUrl = fileData.image.urls.original;

          if (ENV.environment === 'development') {
            fileUrl = ENV.API_HOST + fileUrl;
          }

          cb(fileUrl, {
            title: fileData.image.originalname,
            alt: fileData.image.description,
            width: '100%',
            height: null
          });
        });
      } else {
        return cb();
      }
    };
  },

  openImageSelector(value, meta, cb) {
    set(this, 'fileSelectedCallback', cb);
    Ember.$('.mce-container.mce-floatpanel').hide();
  },

  onHideUploadModal() {
    this.set('fileSelectedCallback', null);
    Ember.$('.mce-container.mce-floatpanel').show();
    this.hideUploadModal();
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
  progress(uploader, e) {
    this.set('percent', e.percent);
  },
  /**
   * did upload action
   *
   * @param  {Object} uploader
   * @param  {Object} e
   */
  didUpload() {
    this.set('uploader', null);
    this.set('description', null);
    this.set('selectedFile', null);
  },

  upload() {
    // done upload...
    this.get('uploader').upload(this.get('selectedFile'), {
      description: (this.get('description') || '')
    })
    .then( (r)=> {
      this.get('fileSelectedCallback')(null, r);
      this.set('fileSelectedCallback', null);

      this.set('uploader', null);
      this.set('selectedFile', null);
      this.set('uploadingImage', false);
      return r;
    })
    .catch( (err)=> {
      this.get('fileSelectedCallback')(err);
      this.set('fileSelectedCallback', null);
      this.hideUploadModal();
      Ember.Logger.error('service:upload.upload:Erro on upload', err);
    });
  },
  didError(uploader, jqXHR, textStatus, errorThrown) {
    Ember.Logger.error('didError>', uploader, jqXHR, textStatus, errorThrown);
  }
});
