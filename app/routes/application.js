import Ember from 'ember';
import { getOwner } from '@ember/application';
import $ from 'jquery';
import { hash } from 'rsvp';
import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { debug } from '@ember/debug';

export default Route.extend(ApplicationRouteMixin, {
  session: inject(),
  acl: inject(),
  intl: inject(),

  ENV: null,

  init() {
    this.set('ENV', getOwner(this).resolveRegistration('config:environment'));
    this._super(...arguments);
  },

  beforeModel() {
    this._super(...arguments);

    // const ENV = this.get('ENV');

    // change default intl.t to send errors to console and dont stop page execution
    this.set('intl.t', this.get('i18n.t'));

    this.get('notifications').setDefaultAutoClear(true);
    this.get('notifications').setDefaultClearDuration(5200);

    let jobs = {};

    if (typeof tinymce === 'undefined'){
      jobs['tinymce'] = $.getScript(
        '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.7.13/tinymce.min.js');
    }

    jobs['locales' ]= this.getLocalesFromHost();

    return hash(jobs);
  },
  model() {
    return hash({
      loadedSettings: this.get('settings').getUserSettings(),
      minimumLoadingDelay: new window.Promise( (resolve)=> {
        setTimeout( ()=> {
          resolve();
        }, 500);
      })
    });
  },
  afterModel() {
    let i18n = this.get('i18n');
    let intl = this.get('intl');

    if (i18n.setLocale) {
      // new api:
      i18n.setLocale(
        this.get('settings.data.defaultLocale') || 'en-us'
      );
      intl.setLocale(
        this.get('settings.data.defaultLocale') || 'en-us'
      );
    }

    document.title = this.get('settings.systemSettings.siteName') + ' | '+document.title;
  },

  /**
   * Get locales from host
   *
   */
  getLocalesFromHost() {
    const  ENV = getOwner(this).resolveRegistration('config:environment');

    let rg1 = new RegExp('{{', 'g');
    let rg2 = new RegExp('}}', 'g');

    return new window.Promise( (resolve, reject)=> {
      $.ajax({
        url: `${ENV.API_HOST}/i18n/get-all-locales`,
        type: 'GET'
      })
      .done( (data)=> {
        if (data && data.locales) {
          // load locales with ember-i18n
          for(let name in data.locales) {

            let langLocs = data.locales[name];

            for(let s in langLocs) {
              if (langLocs[s].indexOf('{{') > -1) {
                langLocs[s] = langLocs[s]
                  .replace(rg1, '{')
                  .replace(rg2, '}');
              }
            }

            this.get('i18n').addTranslations(name, data.locales[name]);
          }
        }

        resolve();
      })
      .fail(reject);
    });
  },
  actions: {
    goTo(route, params) {
      if (params) {
        this.transitionTo(route, params);
      } else {
        this.transitionTo(route);
      }
    },
    showLoginModal() {
      this.set('showLoginModal', true);
    },
    /**
     * Application error handler
     *
     * @param  {Object} err Error object
     */
    error(err) {
      // handle token invalid response, this may occurs if the token is deleted in backend for block access
      if (
        err.status === 401 &&
        err.responseJSON &&
        err.responseJSON.error === 'invalid_grant' &&
        err.responseJSON.error_context === 'authentication'
      ) {
        debug('TODO add message for invalid token invalid_grant', err);
        this.get('session').invalidate();
        return;
      } else if(
        err.errors &&
        err.errors[0].status === '404'
      ) {
        // log it
        Ember.Logger.error('404', err);
        // show message
        this.get('notifications').error('<code>404</code> não encontrado.');
        // redirect ... to 404
        this.transitionTo('/not-found');
      } else {
        this.get('notifications').error('Ocorreu um erro inesperado no servidor!<br>Tente novamente mais tarde ou entre em contato com o administrador do sistema.', {
          htmlContent: true,
          clearDuration: 10000
        });
        Ember.Logger.error(err);
      }
    },
    queryError(err) {
      // todo! add an better validation handling here...
      if (err && err.errors) {
        err.errors.forEach( (e)=> {
          if (e.errorName === 'SequelizeValidationError') {
            // todo! add an better validation handling here...
            this.get('notifications').error(e.title);
          } else {
            this.get('notifications').error(e.title);
          }
        });
      } else if (
        err &&
        err.responseJSON &&
        err.responseJSON.meta &&
        err.responseJSON.meta.messages
      ) {
        err.responseJSON.meta.messages.forEach( (e)=> {
          switch(e.status) {
            case 'warning':
              this.get('notifications').warning(e.message);
              break;
            case 'success':
              this.get('notifications').success(e.message);
              break;
            default:
              this.get('notifications').error(e.message);
          }
        });
      } else if (
        err &&
        err.responseJSON &&
        err.responseJSON &&
        err.responseJSON.messages
      ) {
        err.responseJSON.messages.forEach( (e)=> {
          switch(e.status) {
            case 'warning':
              this.get('notifications').warning(e.message);
              break;
            case 'success':
              this.get('notifications').success(e.message);
              break;
            default:
              this.get('notifications').error(e.message);
          }
        });
      } else {
        debug('Unknow query error', err);
      }
    },

    scrollToTop() {
      // move scroll to top:
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
});