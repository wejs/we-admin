import Ember from 'ember';

export default Ember.Component.extend({
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

      console.log('>link>', link);
      console.log('>link.permission>', link.permission);
      console.log('>can>', acl.can(link.permission));

      if (isAdmin || acl.can(link.permission)) {
        links.pushObject(link);
      }
    }
  }
});
