import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import { A } from '@ember/array';
import { debug } from '@ember/debug';

const systemRoles = [
  'administrator',
  'authenticated',
  'unAuthenticated'
];

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),
  acl: inject('acl'),

  model() {
    return hash({
      data: this.get('acl').getRoles(),
      roles: A([]),
      newRole: {}
    });
  },
  afterModel(model) {
    for (let name in model.data) {
      if (systemRoles.indexOf(name) >-1 ) {
        model.data[name].isSystemRole = true;
      }

      model.roles.push(model.data[name]);
    }
  },
  actions: {
    createRole(role) {
      const roles = this.get('currentModel.data');
      if (roles[role.name]) {
        this.resetNewRole();
        return;
      }

      this.get('acl').createRole(role)
      .then( ()=> {
        const rolesList = this.get('currentModel.roles');
        rolesList.pushObject(role);
        roles[role.name] = role;
        this.resetNewRole();
      })
      .catch( (err)=> {
        debug(err);
      });
    },
    deleteRole(role) {
      if (!confirm('Você tem certeza que deseja deletar esse perfil de usuário?')) {
        return;
      }

      const roles = this.get('currentModel.data');

      this.get('acl').deleteRole(role)
      .then( ()=> {
        const rolesList = this.get('currentModel.roles');
        rolesList.removeObject(role);
        delete roles[role.name];
      })
      .catch( (err)=> {
        debug(err);
      });
    }
  },
  resetNewRole() {
    this.set('currentModel.newRole', {});
  }
});