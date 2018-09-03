import Ember from 'ember';

export default Ember.Component.extend({
  acl: Ember.inject.service('acl'),
  settings: Ember.inject.service('settings'),

  tagName: 'ul',
  ENV: null,

  userRoles: Ember.computed.alias('acl.userRoles'),

  init() {
    this._super(...arguments);

    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('ENV', ENV);

    this.set('links', Ember.A());
    this.set('classNames', [
      'nav', ' in'
    ]);
  },

  didInsertElement() {
    this._super(...arguments);

    const el = this.$();
    if (el && el.metisMenu) {
      this.$().metisMenu();
    }
  },

  didReceiveAttrs() {
    if (this.get('links.length')) {
      // already load
      return;
    }

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

      if (isAdmin || (link.permission && acl.can(link.permission)) ) {
        links.pushObject(link);
      }
    }
  }
});
