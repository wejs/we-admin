import Component from '@ember/component';
import { getOwner } from '@ember/application';

export default Component.extend({
  ENV: null,

  init() {
    this._super(...arguments);

    const ENV = getOwner(this).resolveRegistration('config:environment');

    this.set('ENV', ENV);
  }
});
