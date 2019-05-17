import intl from 'ember-intl/services/intl';
import { debug } from '@ember/debug';
import { assign } from '@ember/polyfills';

export default intl.extend({
  localesToTranslate: null,

  init () {
    this._super(...arguments);
    this.set('localesToTranslate', []);
  },

  /** @public **/
  t(key, options = {}) {
    let defaults = [key];
    let msg;

    if (options.default) {
      defaults = defaults.concat(options.default);
    }

    while (!msg && defaults.length) {
      msg = this.lookup(defaults.shift(), options.locale, assign({}, options, { resilient: defaults.length > 0 }));
    }

    /* Avoids passing msg to intl-messageformat if it is not a string */
    if (typeof msg === 'string') {
      try {
        return this.formatMessage(msg, options);
      } catch(e) {
        debug('i18n:Error on run formatMessage method', e);
        return msg;
      }

    }

    return msg;
  }
});