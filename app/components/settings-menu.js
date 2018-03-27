import Ember from 'ember';

export default Ember.Component.extend({
  ENV: null,
  init() {
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('ENV', ENV);
  }
});

