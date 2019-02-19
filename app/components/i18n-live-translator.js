import Component from '@ember/component';
import { inject } from '@ember/service';
import { bool } from '@ember/object/computed';

export default Component.extend({
  i18n: inject(),

  tagName: 'div',
  classNames: ['i18n-live-translator'],

  haveStringsToTranslate: bool('i18n.localesToTranslate.length')
});
