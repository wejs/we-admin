import Service from '@ember/service';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { debug } from '@ember/debug';
import { bind } from '@ember/runloop';
import fetch from 'fetch';

let ENV;

export default Service.extend({
  store: inject('store'),
  session: inject('session'),
  notifications: inject('notifications'),
  ajax: inject('ajax'),

  ENV: null,

  init() {
    this._super(...arguments);

    this.set('themeCollorOptions', [
      { id: 'default', name: 'Cor padrão do tema' },
      // { id: 'dark', name: 'Tema escuro'}
    ]);

    ENV = getOwner(this).resolveRegistration('config:environment');
    this.set('ENV', ENV);
  },

  data: null,

  accessToken: computed.alias('session.session.authenticated.access_token'),

  authenticatedUserId: computed.alias('user.id'),
  user: null,
  // alias for help get current authenticated user roles
  userRoles: computed.alias('user.roles'),

  isAdmin: computed('userRoles', function () {
    let roles = this.userRoles;
    if (!roles || !roles.indexOf) {
      return false;
    }
    return (roles.indexOf('administrator') > -1);
  }),
  // invert isAdmin to use in disabled inputs
  notIsAdmin: computed.not('isAdmin'),

  systemSettings: computed.alias('data.systemSettings'),

  imageHost: computed.alias('ENV.imageHost'),

  defaultClientDateFormat: 'DD/MM/YYYY hh:ss',
  dateFormat: computed.or('data.date.defaultFormat', 'defaultClientDateFormat'),

  themeCollorOptions: null,

  getUserSettings() {
    return this.ajax.request('/user-settings?adminMenu=true')
      .then((response) => {
        // return to fix safari wrong empty return:
        if (!response) return;
        // sync authe between site and admin:
        if (response.authenticatedUser) {
          if (!this.session.isAuthenticated) {
            debug('should be authenticated...');
            // authenticate ...
            return this.session
              .authenticate(
                'authenticator:custom',
                response.authenticatedUser.email,
                null,
                response.authenticatedUser.id
              )
              .then(() => {
                return response;
              });
          }
        } else {
          // user not is authenticated:
          if (this.session.isAuthenticated) {
            return this.session.invalidate().then(() => {
              location.reload();
              return response;
            });
          }
        }

        return response;
      })
      .then((response) => {
        this.set('data', response);

        if (response.authenticatedUser) {
          return this.store
            .findRecord('user', response.authenticatedUser.id)
            .then((u) => {
              this.set('user', u);
              return response;
            });
        } else {
          return response;
        }
      });
  },

  setSystemSettings(newData) {
    const self = this;

    return this.ajax.request(ENV.API_HOST + '/system-settings', {
      type: 'POST',
      data: newData
    })
    .then((data) => {
      bind(this, function () {
        self.set('systemSettings', data);
        return data;
      });
    });
  },

  getThemeConfigs() {
    return this.ajax.request(ENV.API_HOST + '/theme', {
      method: 'GET',
      cache: false
    })
    .then((response) => {
      return response;
    });
  },

  defaultSelectorLinksComponents() {
    return [
      {
        name: 'content',
        title: 'Links para páginas',
        componentName: 'menu-page-selector'
      },
      {
        name: 'custom',
        title: 'Links personalizados',
        componentName: 'menu-custom-link-form'
      },
      {
        name: 'category',
        title: 'Links para categorias',
        componentName: 'menu-category-selector'
      },
      {
        name: 'tags',
        title: 'Links para tags',
        componentName: 'menu-tag-selector'
      }
    ];
  },

  getHeaders() {
    let headers = { Accept: 'application/vnd.api+json' },
      accessToken = this.session.session.get('authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return headers;
  },

  slugfy(str) {
    if (!str) {
      return null;
    }

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to = 'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------';
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  },

  handleMessages(responseData) {
    return this.queryError(responseData);
  },

  queryError(err) {
    // todo! add an better validation handling here...
    if (err && err.errors) {
      err.errors.forEach((e) => {
        if (e.errorName === 'SequelizeValidationError') {
          // todo! add an better validation handling here...
          this.notifications.error(e.title);
        } else {
          this.notifications.error(e.title);
        }
      });
    } else if (
      err &&
      err.meta &&
      err.meta.messages
    ) {
      err.meta.messages.forEach((e) => {
        switch (e.status) {
          case 'warning':
            this.notifications.warning(e.message);
            break;
          case 'success':
            this.notifications.success(e.message);
            break;
          default:
            this.notifications.error(e.message);
        }
      });
    } else if (
      err &&
      err.responseJSON &&
      err.responseJSON.meta &&
      err.responseJSON.meta.messages
    ) {
      err.responseJSON.meta.messages.forEach((e) => {
        switch (e.status) {
          case 'warning':
            this.notifications.warning(e.message);
            break;
          case 'success':
            this.notifications.success(e.message);
            break;
          default:
            this.notifications.error(e.message);
        }
      });
    } else if (
      err &&
      err.responseJSON &&
      err.responseJSON &&
      err.responseJSON.messages
    ) {
      err.responseJSON.messages.forEach((e) => {
        switch (e.status) {
          case 'warning':
            this.notifications.warning(e.message);
            break;
          case 'success':
            this.notifications.success(e.message);
            break;
          default:
            this.notifications.error(e.message);
        }
      });

    } else if (
      err &&
      err.messages
    ) {
      err.messages.forEach((e) => {
        switch (e.status) {
          case 'warning':
            this.notifications.warning(e.message);
            break;
          case 'success':
            this.notifications.success(e.message);
            break;
          default:
            this.notifications.error(e.message);
        }
      });
    } else {
      debug('Unknow query error', { error: err });
      console.error('Unknow query error', { error: err });
    }
  }
});
