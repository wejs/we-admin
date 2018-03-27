import Ember from 'ember';

export default Ember.Component.extend({
  acl: Ember.inject.service('acl'),

  permission: null,
  can: Ember.computed('permission', function() {
    const permission = this.get('permission');
    const acl = this.get('acl');

    if (acl.can(permission)) {
      return true;
    } else {
      return false;
    }
  })
});
