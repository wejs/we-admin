import Ember from 'ember';

let ENV;

export default Ember.Service.extend({
  store: Ember.inject.service('store'),
  session: Ember.inject.service('session'),

  init(){
    this._super(...arguments);

    ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    this.set('ENV', ENV);
  },

  data: null,

  accessToken: Ember.computed.alias('session.session.authenticated.access_token'),

  authenticatedUserId: Ember.computed.alias('session.session.authenticated.user.id'),
  user: null,
  // alias for help get current authenticated user roles
  userRoles: Ember.computed.alias('user.roles'),

  isAdmin: Ember.computed('userRoles', function(){
    let roles = this.get('userRoles');
    return (roles.indexOf('administrator') > -1 );
  }),
  // invert isAdmin to use in disabled inputs
  notIsAdmin: Ember.computed.not('isAdmin'),

  systemSettings: Ember.computed.alias('data.systemSettings'),

  imageHost: Ember.computed.alias('ENV.imageHost'),

  themeCollorOptions: [
    { id: 'default', name: 'Cor padrão do tema'},
    // { id: 'dark', name: 'Tema escuro'}
  ],

  getUserSettings() {
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return Ember.$.ajax({
      url: ENV.API_HOST + '/user-settings?adminMenu=true',
      type: 'GET',
      cache: false,
      headers: headers
    })
    .then( (response)=> {
      // sync authe between site and admin:
      if (response.authenticatedUser) {
        if (!this.get('session.isAuthenticated')) {
          console.log('should be authenticated...');
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
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return Ember.$.ajax({
      url: ENV.API_HOST + '/system-settings',
      type: 'POST',
      cache: false,
      headers: headers,
      data: newData
    })
    .then( (response)=> {
      this.set('systemSettings', response);
      return response;
    });
  },


  getThemeConfigs() {
    // const uid = this.get('authenticatedUserId');
    let headers = { Accept: 'application/vnd.api+json' },
        accessToken = this.get('accessToken');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return Ember.$.ajax({
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
  }
});
