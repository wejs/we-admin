import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ENV from "../config/environment";
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import $ from 'jquery';
import { bind } from '@ember/runloop';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const settings = this.get('settings');

    return hash({
      user: settings.get('user'),
      oldPassword: null,
      newPassword: null,
      rNewPassword: null
    });
  },

  actions: {
    save(user) {
      user.save()
      .then( (r)=> {
        this.get('notifications').success('Dados do perfil salvos.');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },

    changePassword(model) {
      let headers = { Accept: 'application/vnd.api+json' },
          accessToken = this.get('settings.accessToken');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      $.ajax({
        url: ENV.API_HOST + '/auth/change-password',
        type: 'POST',
        data: {
          password: model.oldPassword,
          newPassword: model.newPassword,
          rNewPassword: model.rNewPassword
        },
        cache: false,
        headers: headers
      })
      .then( ()=> {
        bind(this, function() {
          this.get('notifications').success('Senha alterada com sucesso.');

          model.oldPassword = null;
          model.newPassword = null;
          model.rNewPassword = null;
        });
      })
      .fail( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});