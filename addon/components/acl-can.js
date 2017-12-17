import Ember from 'ember';
import layout from '../templates/components/acl-can';

export default Ember.Component.extend({
  layout,
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
