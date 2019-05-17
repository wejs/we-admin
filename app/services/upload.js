import Ember from 'ember';
import { A } from '@ember/array';
import { set, observer, computed } from '@ember/object';
import Uploader from 'ember-uploader/uploaders/uploader';
import { getOwner } from '@ember/application';
import { inject } from '@ember/service';
import $ from 'jquery';
import Service from '@ember/service';
import { eResolve } from 'rsvp';
import { bind } from '@ember/runloop';

let ENV;

export default Service.extend({
  notifications: inject('notification-messages'),
  session: inject(),

  modalOpen: computed.alias('fileSelectedCallback'),

  notReadyToUploadOB: observer('imagesToUpload.length', 'filesToUpload.length', function() {
    if (
      this.get('imagesToUpload.length') ||
      this.get('filesToUpload.length')
    ) {
      return this.set('notReadyToUpload', false);
    }

    this.set('notReadyToUpload', true);
  }),
  notReadyToUpload: true,

  error: null,

  uploadingImage: false,
  description: null,

  fileSelectedCallback: null,
  // list of images to upload
  imagesToUpload: null,
  // list of generic files to upload
  filesToUpload: null,

  init() {
    this._super(...arguments);

    ENV = getOwner(this).resolveRegistration('config:environment');

    this.set('imageURL', `${ENV.API_HOST}/api/v1/image`);
    this.set('fileURL', `${ENV.API_HOST}/api/v1/file`);
  },

  // image methods:

  initUploadMecanism() {
    this.set('imagesToUpload', A());
    this.set('filesToUpload', A());
  },
  addImageToUpload(f) {
    if (!f || typeof f !== 'object') {
      return;
    }
    set(f, 'isUploading', false);
    set(f, 'uploader', Uploader.create({
      ajaxSettings: {
        headers: this.getHeaders()
      },
      paramName: 'image',
      url: this.get('imageURL')
    }));

    set(f, 'percent', 0);

    /**
     * Start upload of this file:
     */
    f.upload = function startImageUpload() {
      return new window.Promise( (resolve, reject)=> {
        let uploader = this.uploader;
        let file = this;

        set(f, 'isUploading', true);
        set(f, 'isInAction', true);
        set(f, 'barType', 'info');
        set(f, 'uploadError', null);
        set(f, 'uploadSuccess', false);

        uploader.on('progress', e => {
          if (!e.percent) {
            e.percent = 0;
          }
          set(f, 'percent', Math.floor(e.percent));
        });

        uploader.on('didUpload', ()=> {
          set(f, 'barType', 'success');
          set(f, 'isInAction', false);
        });

        // (jqXHR,    textStatus,   errorThrown) =>
        uploader.on('didError', () => {
          set(f, 'barType', 'danger');
          set(f, 'isInAction', false);
        });

        uploader.upload(file, {
          description: (this.description || '')
        })
        .then( (r)=> {
          set(f, 'uploadSuccess', true);
          resolve(r);
        })
        .catch( (err)=> {
          set(f, 'uploadSuccess', false);
          set(f, 'uploadError', err);
          Ember.Logger.error('service:upload.upload:Erro on upload', err);
          reject(err);
        });
      });
    }
    .bind(f);

    this.get('imagesToUpload').pushObject(f);
  },
  removeImageFromUploadList(image) {
    this.get('imagesToUpload').removeObject(image);
  },

  // file methods:

  addFileToUpload(f) {
    if (!f || typeof f !== 'object') {
      return;
    }
    set(f, 'isUploading', false);
    set(f, 'uploader', Uploader.create({
      ajaxSettings: {
        headers: this.getHeaders()
      },
      paramName: 'file',
      url: this.get('fileURL')
    }));

    set(f, 'percent', 0);
    /**
     * Start upload of this file:
     */
    f.upload = function startFileUpload() {
      return new window.Promise( (resolve, reject)=> {
        let uploader = this.uploader;
        let file = this;

        set(f, 'isUploading', true);
        set(f, 'isInAction', true);
        set(f, 'barType', 'info');
        set(f, 'uploadError', null);
        set(f, 'uploadSuccess', false);

        uploader.on('progress', e => {
          if (!e.percent) {
            e.percent = 0;
          }
          // Handle progress changes
          // Use `e.percent` to get percentage
          set(f, 'percent', Math.floor(e.percent));
        });
        // (e)=>
        uploader.on('didUpload', ()=> {
          set(f, 'barType', 'success');
          set(f, 'isInAction', false);
          // console.log('didUpload', e);
        });

        // (jqXHR,    textStatus,   errorThrown)=>
        uploader.on('didError', () => {
          set(f, 'barType', 'danger');
          set(f, 'isInAction', false);
        });

        uploader.upload(file, {
          description: (this.description || '')
        })
        .then( (r)=> {
          set(f, 'uploadSuccess', true);
          resolve(r);
        })
        .catch( (err)=> {
          set(f, 'uploadSuccess', false);
          set(f, 'uploadError', err);
          Ember.Logger.error('service:upload.upload:Erro on upload', err);
          reject(err);
        });
      });
    }
    .bind(f);

    this.get('filesToUpload').pushObject(f);
  },
  removeFileFromUploadList(file) {
    this.get('filesToUpload').removeObject(file);
  },

  // Cancel upload and reset lists:
  cancel() {
    this.set('imagesToUpload', A());
    this.set('filesToUpload', A());
  },

  uploadImages() {
    return new window.Promise( (resolve, reject)=> {
      let results = [];
      let imagesToUpload = this.get('imagesToUpload');
      if (!imagesToUpload || !imagesToUpload.length) {
        return resolve();
      }

      imagesToUpload.reduce( function (prom, ITU) {
        return prom.then(function() {
          return ITU.upload()
          .then( (result)=> {
            if (result && result.image) {
              results.push(result.image);
            }
          })
          .catch( (err)=> {
            // console.log('err>', err);
            return err;
          });
        });
      },
        eResolve()
      )
      .then( ()=> { // after all
        this.set('imagesToUpload', A());
        this.set('filesToUpload', A());
        resolve(results);

      })
      .catch( (err)=> {
        this.set('imagesToUpload', A());
        this.set('filesToUpload', A());
        reject(err);
      });
    });
  },

  uploadFiles() {
    return new window.Promise( (resolve, reject)=> {
      let results = [];
      let filesToUpload = this.get('filesToUpload');
      if (!filesToUpload || !filesToUpload.length) {
        return resolve();
      }

      filesToUpload.reduce( function (prom, ITU) {
        return prom.then(function() {
          return ITU.upload()
          .then( (result)=> {
            if (result && result.file) {
              results.push(result.file);
            }
          })
          .catch( (err)=> {
            // console.log('err>', err);
            return err;
          });
        });
      },
        eResolve()
      )
      .then( ()=> { // after all
        this.set('imagesToUpload', A());
        this.set('filesToUpload', A());
        resolve(results);

      })
      .catch( (err)=> {
        this.set('imagesToUpload', A());
        this.set('filesToUpload', A());
        reject(err);
      });
    });
  },

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
    $('.mce-container.mce-floatpanel').hide();
  },

  onHideUploadModal() {
    this.set('fileSelectedCallback', null);
    $('.mce-container.mce-floatpanel').show();
    this.hideUploadModal();
  },

  hideUploadModal() {
    if (this.get('uploadingImage')) {
      this.set('uploadingImage', false);
    }

    this.set('error', null);
    this.set('uploader', null);
    this.set('selectedFile', null);
    this.set('description', null);
    this.set('uploadingImage', false);
  },
  /**
   * Deprecated selected method
   *
   * @param  {Array} files
   */
  selected() {
    // console.log('DEPRECATED! old upload.selected');
    // const file = files[0];
    // this.set('selectedFile', file);
    // const reader = new FileReader();

    // reader.onload = (e)=> {
    //   // get local file src
    //   this.set('previewImageSrc', e.target.result);

    //   let fileSizeInMB = Math.round(file.size/1024/1024);

    //   if (fileSizeInMB >= 10) {

    //     this.get('notifications').error('A imagem selecionada tem '+fileSizeInMB+'MB'+
    //       ' e o limite de envio de imagens é 10MB. Selecione uma imagem com menos de 10MB de tamanho.');
    //     this.hideUploadModal();
    //   }
    // };
    // reader.readAsDataURL(file);
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
    // this.set('uploader', null);
    // this.set('description', null);
    // this.set('selectedFile', null);
  },

  uploadForTextEditor() {
    this.set('isLOading', true);

    this.uploadImages()
    .then( (results)=> {
      this.fileSelectedCallback(null, {
        image: results[0]
      });

      this.set('imagesToUpload', A());
      this.set('filesToUpload', A());

      this.set('isLOading', false);
      this.onHideUploadModal();

    })
    .catch( (err)=> {
      this.get('notifications').error('Erro ao enviar a imagem para o servidor, tente novamente mais tarde');
      Ember.Logger.error(err);
      this.set('isLOading', false);
    });
  },
  didError(uploader, jqXHR, textStatus, errorThrown) {
    Ember.Logger.error('didError>', uploader, jqXHR, textStatus, errorThrown);
  },

  onSelectSalvedImage(image) {
    this.hideUploadModal();

    this.get('fileSelectedCallback')(null, {
      image: image
    });

    this.set('fileSelectedCallback', null);
    this.set('uploader', null);
    this.set('selectedFile', null);
    this.set('uploadingImage', false);
  },

  updateImageDescription(image) {
    this.updateDescription(image, 'image');
  },

  updateFileDescription(file) {
    this.updateDescription(file, 'file');
  },

  updateDescription(record, model) {
    let headers = this.getHeaders();

    return $.ajax({
      url: ENV.API_HOST + '/api/v1/'+model+'/'+record.id,
      type: 'POST',
      cache: false,
      headers: headers,
      data: {
        description: record.description
      }
    })
    .then( ()=> {
      bind(this, function() {
        this.get('notifications').success('Descrição atualizada com sucesso');
      });
    })
    .catch( ()=> {
      bind(this, function() {
        this.get('notifications')
        .error('Erro ao atualizar a descrição, tente novamente mais tarde ou entre em contato com um administrador');
      });
    });
  },

  getHeaders() {
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('session.session.authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }
    return headers;
  }
});
