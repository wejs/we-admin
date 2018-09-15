import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  acl: inject('acl'),

  permission: null,
  can: computed('permission', function() {
    const permission = this.get('permission');
    const acl = this.get('acl');

    if (acl.can(permission)) {
      return true;
    } else {
      return false;
    }
  })
});
