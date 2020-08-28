import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// import { oneWay } from '@ember/object/computed';
// import { set, action } from '@ember/object';
// import { computed } from '@ember/object';

export default class UIUploadImageTRComponent extends Component {
  @service upload;

  @action
  updateDescription() {
    const image = this.args.image;
    this.upload.updateImageDescription(image, image.description);
  }

  @action
  removeImage() {
    if (this.args.onRemoveImage) {
      this.args.onRemoveImage(this.args.image);
    }
  }
}