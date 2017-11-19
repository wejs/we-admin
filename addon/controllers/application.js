import Ember from 'ember';

export default Ember.Controller.extend({
  settings: Ember.inject.service('settings'),
  settingsLoaded: Ember.computed.alias('settings.loaded'),
  appName: Ember.computed.alias('settings.data.appName'),
  appLogo: Ember.computed.alias('settings.data.appLogo')
});