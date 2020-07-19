import { isEmpty } from '@ember/utils';
import FileField from 'ember-uploader/components/file-field';
import { inject } from '@ember/service';

export default FileField.extend({
  session: inject('session'),
  accept: "image/*|image/heic|image/heif",

  uploader: null,

  filesDidChange(files) {
    if (isEmpty(files)) {
      this.set('uploader', null);
      return;
    }

    // const uploader = Uploader.create({
    //   ajaxSettings: {
    //     headers: this.getHeaders()
    //   },
    //   paramName: 'image',
    //   url: this.get('url')
    // });

    // this.set('uploader', uploader);

    // this.sendAction('selected', files);

    // uploader.on('progress', e => {
    //   if (!this.isDestroyed) {
    //     // Handle progress changes
    //     // Use `e.percent` to get percentage
    //     this.sendAction('progress',uploader, e);
    //   }
    // });

    // uploader.on('didUpload', e => {
    //   if (!this.isDestroyed) {
    //     // Handle finished upload
    //     this.sendAction('didUpload',uploader, e);
    //   }
    // });

    // uploader.on('didError', (jqXHR, textStatus, errorThrown) => {
    //   if (!this.isDestroyed) {
    //     // Handle unsuccessful upload
    //     this.sendAction('didError',uploader, jqXHR, textStatus, errorThrown);
    //   }
    // });
  }
});
