import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import { getOwner } from '@ember/application';

export default class UIImageComponent extends Component {
  @service settings;

  @computed('args.{file,size}')
  get src() {
    let file = this.args.file;

    if (isArray(file)) {
      if (file.firstObject) {
        file = get(file, 'firstObject');
      } else {
        file = file[0];
      }
    }

    // file.urls is required
    if (!file || !file.urls) {
      return '';
    }

    let ENV = getOwner(this).resolveRegistration('config:environment');

    let src = get(file, 'urls.' + (this.args.size || 'thumbnail') );

    if (src.startsWith('HTT') || src.startsWith('htt')) {
      return src;
    } else {
      return (ENV.imageHost + src);
    }
  }
}