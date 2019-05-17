import ENV from "../config/environment";

import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import $ from 'jquery';
import { bind } from '@ember/runloop';
import { debug } from '@ember/debug';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  session: inject('session'),

  model() {
    return {
      email: ''
    };
  },
  actions: {
    requestPasswordChange() {
      const email = this.get('currentModel.email');

      if (!email) {
        debug('email is required');
        return;
      }

      let headers = { Accept: 'application/json' };

      $.ajax({
        url: `${ENV.API_HOST}/auth/forgot-password`,
        type: 'POST',
        headers: headers,
        data: {
          email: email
        }
      })
      .done( (result)=> {
        bind(this, function() {
          // reset email:
          this.set('currentModel.email', '');
          // then show the result as notification:
          if (result && result.messages) {
            result.messages.forEach( (m)=> {
              if (m.status === 'success') {
                this.get('notifications').success(m.message);
              } else {
                this.get('notifications').error(m.message);
              }
            });
          } else {
            debug('Unknow success response on forgot-password page');
          }
        });
      })
      .fail( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});