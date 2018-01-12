import Ember from 'ember';
import layout from '../templates/components/menu-admin';

export default Ember.Component.extend({
  layout,

  acl: Ember.inject.service('acl'),
  settings: Ember.inject.service('settings'),

  tagName: 'ul',
  classNames: [
    'nav', ' in'
  ],

  ENV: null,

  userRoles: Ember.computed.alias('acl.userRoles'),

  links: Ember.A(),

  init() {
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('ENV', ENV);
  },

  didInsertElement() {
    this._super(...arguments);

    const el = this.$();
    if (el && el.metisMenu) {
      this.$().metisMenu();
    }
  },

  didReceiveAttrs() {
    const links = this.get('links'),
      allLinks = this.get('ENV.adminMenu'),
      acl = this.get('acl'),
      plugins = this.get('settings.data.plugins'),
      isAdmin = this.get('acl.isAdmin');

    for (let i = 0; i < allLinks.length; i++) {
      let link = allLinks[i];

      if (link.plugin) {
        // plugin requirement:
        if (plugins.indexOf(link.plugin) === -1) {
          continue;
        }
      }

      if (isAdmin || acl.can(link.permission)) {
        links.pushObject(link);
      }
    }
  }
});
