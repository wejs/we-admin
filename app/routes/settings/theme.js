import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const get = Ember.get;
let ENV;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  ajax: Ember.inject.service(),
  image: Ember.inject.service(),

  init() {
    this._super(...arguments);
    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
  },

  model() {
    const systemSettings = (this.get('settings').get('systemSettings') || '');

    return Ember.RSVP.hash({
      settings: systemSettings,
      themeCollorOptions: [],
      themeConfigName: null,
      themeCollor: null,
      updateAvaible: null,
      themeConfigs: this.get('settings').getThemeConfigs()
    });
  },

  afterModel(model) {
    const settings = this.get('settings.systemSettings');

    const ts = model.themeConfigs.themes;

    model.themeConfigName = model.themeConfigs.enabled+'ColorName';

    for (let themeName in ts) {
      const t = ts[themeName];

      if (
        themeName !== model.themeConfigs.enabled ||
        !t.configs.colors
      ) {
        continue;
      }

      if (settings[themeName+'ColorName'] && t.configs.colors) {
        // has selected color:
        model.themeCollor = t.configs.colors[settings[themeName+'ColorName']];
      } else {
        model.themeCollor = t.configs.colors.default;
      }

      if (t.configs && t.configs.colors) {
        for (let colorName in t.configs.colors) {
          const c = t.configs.colors[ colorName ];

          if (!c.id) {
            c.id = colorName;
          }

          model.themeCollorOptions.push(c);
        }
      }
    }

    this.verifyCurrentThemeUpdate(model);
  },

  verifyCurrentThemeUpdate(model) {
    const settings = this.get('settings.systemSettings');

    if (
      !settings.themesToUpdate ||
      !model.themeConfigs.enabled
    ) {
      return null;
    }

    const name = model.themeConfigs.enabled;
    let themesToUpdate;

    try {
      themesToUpdate = JSON.parse(settings.themesToUpdate);
    } catch(e) {
      Ember.Logger.error(e);
    }

    if (themesToUpdate && themesToUpdate[name]) {
      model.updateAvaible = themesToUpdate[name];
    }
  },

  removeUpdatedThemeFromToUpdateList() {
    const settings = this.get('settings.systemSettings');
    const model = this.get('currentModel');
    const name = model.themeConfigs.enabled;

    let themesToUpdate = JSON.parse(settings.themesToUpdate);

    delete themesToUpdate[name];

    this.set('settings.systemSettings.themesToUpdate', JSON.stringify(themesToUpdate));
  },

  actions: {
    save(data) {
      const model = this.get('currentModel');
      let s = this.get('settings');
      let color = 'default';
      const themeCollor = get(model, 'themeCollor');

      if (themeCollor) {
        color = themeCollor.id;
      }

      data[ get(model, 'themeConfigName') ] = color;

      s.setSystemSettings(data)
      .then( (result) => {
        Ember.set(s, 'systemSettings', result.settings);

        this.get('notifications').success('As configurações do sistema foram salvas.');
        this.send('scrollToTop');
      })
      .fail( (err)=> {
        this.send('queryError', err);
      });
    },

    installTheme(theme, color, colorName) {
      const release = Ember.get(theme, 'release');

      if (!colorName) {
        colorName = 'default';
      }

      return new window.Promise( (resolve, reject)=> {
        if (!release) {
          Ember.Logger.warn('installTheme:theme.release is required');
          return resolve();
        }

        let headers = { Accept: 'application/vnd.api+json' },
            accessToken = this.get('session.session.authenticated.access_token');

        if (accessToken) {
          headers.Authorization = `Basic ${accessToken}`;
        }

        let url = `${ENV.API_HOST}/admin/theme/${theme.gitRepositoryName}/install`;

        Ember.$.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            name: theme.gitRepositoryName,
            release: release,
            colorName: colorName
          }),
          headers: headers
        })
        .done( (data)=> {
          if (data && data.meta && data.meta.updatedSettings) {

            this.get('settings').set('systemSettings', data.meta.updatedSettings);
          }

          resolve(data);
          return null;
        })
        .fail(reject);
      })
      .then( (data)=> {
        if (data && data.meta && data.meta.messages) {
          data.meta.messages.forEach( (m)=> {
            this.get('notifications').success(m.message);
          });
        } else {
          this.get('notifications').success('Tema instalado com sucesso.');
        }

        this.transitionTo('/settings/theme');
        return this.refresh();
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },

    updateTheme(themeName, release) {
      return new window.Promise( (resolve, reject)=> {

        if (!release) {
          Ember.Logger.warn('updateTheme:theme.release is required');
          return resolve();
        }

        let headers = { Accept: 'application/vnd.api+json' },
            accessToken = this.get('session.session.authenticated.access_token');

        if (accessToken) {
          headers.Authorization = `Basic ${accessToken}`;
        }

        let url = `${ENV.API_HOST}/admin/theme/${themeName}/update`;

        Ember.$.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            name: themeName,
            release: release
          }),
          headers: headers
        })
        .done( (data)=> {
          if (data && data.themesToUpdate) {
            this.set('settings.systemSettings.themesToUpdate', data.themesToUpdate);
          } else {
            this.removeUpdatedThemeFromToUpdateList();
          }

          this.set('currentModel.updateAvaible', false);

          resolve(data);
          return null;
        })
        .fail(reject);
      })
      .then( (data)=> {
        if (data && data.meta && data.meta.messages) {
          data.meta.messages.forEach( (m)=> {
            this.get('notifications').success(m.message);
          });
        } else {
          this.get('notifications').success('Tema atualizado com sucesso.');
        }
        return this.refresh();
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});
