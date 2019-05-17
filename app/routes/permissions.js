import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),
  acl: inject('acl'),

  model() {
    return hash({
      data: this.getPermissionsAndRoles()
    });
  },
  afterModel(model) {
    model.roleNames = Object.keys(model.data.roles);
    model.permissionNames = Object.keys(model.data.permissions);
  },
  getPermissionsAndRoles() {
    return this.get('acl').getPermissionsAndRoles();
  },

  actions: {
    addPermission(roleName, permissionName, cb) {
      this.get('acl').addPermissionToRole(roleName, permissionName)
      .then( ()=> {
        cb();
        return null;
      })
      .catch(()=>{
        cb();
      });
    },
    removePermission(roleName, permissionName, cb) {
      this.get('acl').removePermissionFromRole(roleName, permissionName)
      .then( ()=> {
        cb();
        return null;
      })
      .catch(()=>{
        cb();
      });
    }
  }
});