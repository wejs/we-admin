import Service from '@ember/service';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import $ from 'jquery';
import { debug } from '@ember/debug';
import { bind } from '@ember/runloop';

let ENV;

export default Service.extend({
  store: inject('store'),
  session: inject('session'),

  init(){
    this._super(...arguments);

    this.set('themeCollorOptions', [
      { id: 'default', name: 'Cor padrão do tema'},
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

  isAdmin: computed('userRoles', function() {
    let roles = this.get('userRoles');
    if (!roles || !roles.indexOf) {
      return false;
    }
    return (roles.indexOf('administrator') > -1 );
  }),
  // invert isAdmin to use in disabled inputs
  notIsAdmin: computed.not('isAdmin'),

  systemSettings: computed.alias('data.systemSettings'),

  imageHost: computed.alias('ENV.imageHost'),

  defaultClientDateFormat: 'DD/MM/YYYY hh:ss',
  dateFormat: computed.or('data.date.defaultFormat', 'defaultClientDateFormat'),

  themeCollorOptions: null,

  getUserSettings() {
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return $.ajax({
      url: ENV.API_HOST + '/user-settings?adminMenu=true',
      type: 'GET',
      cache: false,
      headers: headers
    })
    .then( (response)=> {
      // sync authe between site and admin:
      if (response.authenticatedUser) {
        if (!this.get('session.isAuthenticated')) {
          debug('should be authenticated...');
          // authenticate ...
          return this.get('session')
          .authenticate(
            'authenticator:custom',
            response.authenticatedUser.email,
            null,
            response.authenticatedUser.id
          )
          .then( ()=> {
            location.reload();
            return response;
          });
        }
      } else {
        // user not is authenticated:
        if (this.get('session.isAuthenticated')) {
          return this.get('session').invalidate().then(()=> {
            location.reload();
            return response;
          });
        }
      }

      return response;
    })
    .then( (response)=> {
      this.set('data', response);

      if (response.authenticatedUser) {
        return this.get('store')
        .findRecord('user', response.authenticatedUser.id)
        .then( (u)=> {
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
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return $.ajax({
      url: ENV.API_HOST + '/system-settings',
      type: 'POST',
      cache: false,
      headers: headers,
      data: newData
    })
    .then( (response)=> {
      bind(this, function() {
        self.set('systemSettings', response);
        return response;
      });

    });
  },

  getThemeConfigs() {
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return $.ajax({
      url: ENV.API_HOST + '/theme',
      type: 'get',
      cache: false,
      headers: headers
    })
    .then( (response)=> {
      // this.set('systemSettings', response);
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
        accessToken = this.get('session.session.authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return headers;
  },

  slugfy (str) {
    if (!str) {
      return null;
    }

    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }
});
