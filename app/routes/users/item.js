import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject } from '@ember/service';
import $ from 'jquery';
import { A } from '@ember/array';
import { bind } from '@ember/runloop';
import ENV from "../../config/environment";

const userMenuTabs = [
  'userTabPaneData',
  'userTabPanePassword',
  'userTabPaneRoles'
];

export default Route.extend(AuthenticatedRouteMixin, {
  notifications: inject('notification-messages'),
  acl: inject('acl'),

  queryParams: {
    tab: { refreshModel: false }
  },

  model(params) {

    if (userMenuTabs.indexOf(params.tab) === -1) {
      params.tab = 'userTabPaneData';
    }

    return hash({
      user: this.get('store').findRecord('user', params.id),
      roles: this.get('acl').getRolesArray(),
      newPassword: null,
      rNewPassword: null,
      tab: params.tab
    });
  },
  actions: {
    save(user) {
      user.save()
      .then( (r)=> {
        this.get('notifications').success('Dados salvos.');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },

    changeActiveStatus(user, status) {
      user.set('active', status);
      user.save()
      .then( (r)=> {
        if (status) {
          this.get('notifications').success('Conta de usuário ativada.');
        } else {
          this.get('notifications').success('Conta de usuário desativada.');
        }

        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },

    changeBlockStatus(user, status) {
     let headers = {
        Accept: 'application/vnd.api+json'
      };

      let accessToken = this.get('session.session.authenticated.access_token');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      $.ajax({
        url: ENV.API_HOST + '/block-user/'+ user.id,
        type: 'POST',
        data: { blocked: status },
        cache: false,
        headers: headers
      })
      .then( ()=> {
        bind(this, function() {
          user.set('blocked', status);

          if (status) {
            this.get('notifications').success('Usuário bloqueado.');
          } else {
            this.get('notifications').success('Usuário desbloqueado.');
          }
        });
      })
      .fail( (err)=> {
        bind(this, function() {
          this.send('queryError', err);
        });
      });
    },

    changePassword(model) {
     let headers = {
        Accept: 'application/vnd.api+json'
      };

      let accessToken = this.get('session.session.authenticated.access_token');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      $.ajax({
        url: ENV.API_HOST + '/auth/'+ model.user.id +'/new-password',
        type: 'POST',
        data: {
          newPassword: model.newPassword,
          rNewPassword: model.rNewPassword
        },
        cache: false,
        headers: headers
      })
      .then( (response)=> {
        bind(this, function() {
          this.get('notifications').success('Senha alterada com sucesso.');

          this.set('currentModel.newPassword', null);
          this.set('currentModel.rNewPassword', null);
          // success
          return response;
        });
      })
      .fail( (err)=> {
        bind(this, function() {
          this.send('queryError', err);
        });
      });
    },
    addUserRole(roleName, user, cb) {
      let userRoles = user.get('roles');

      if (!userRoles) {
        user.set('roles', A());
        userRoles = user.get('roles');
      }

      if (userRoles.indexOf(roleName) > -1) {
        // this user already have the role:
        return cb();
      }

      userRoles.push(roleName);

      return this.get('acl')
      .updateUserRoles(userRoles, user.id)
      .then( ()=> {
        cb();
        return null;
      })
      .catch(cb);
    },
    removeUserRole(roleName, user, cb) {
      let userRoles = user.get('roles');
      const acl = this.get('acl');

      if (!userRoles) {
        user.set('roles', A());
        userRoles = user.get('roles');
      }

      if (userRoles.indexOf(roleName) === -1) {
        // this user dont have the role:
        return cb();
      }

      const index = userRoles.indexOf(roleName);
      if (index !== -1) {
        userRoles.splice( index, 1 );
      }

      return acl.updateUserRoles(userRoles, user.id)
      .then( ()=> {
        cb();
        return null;
      })
      .catch(cb);
    }
  }
});