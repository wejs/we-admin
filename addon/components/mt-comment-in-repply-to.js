import Ember from 'ember';
import layout from '../templates/components/mt-comment-in-repply-to';

export default Ember.Component.extend({
  layout,

  ENV: null,

  init() {
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('ENV', ENV);
  }
});
