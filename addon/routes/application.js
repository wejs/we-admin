import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { Promise, hash } from 'rsvp';
import fetch from 'fetch';

if (!window.Promise) {
  window.Promise = Promise;
}

export default class ApplicationRoute extends Route {
  @service session;
  @service acl;
  @service intl;
  @service settings;
  @service notifications;
  @service currentUser;
  @service interface;
  @service metrics;
  @service router;
  @service('title') titleService;

  constructor () {
    super(...arguments);

    let router = this.router;
    router.on('routeDidChange', () => {
      const page = '/dashboard' + router.currentURL;
      const title = router.currentRouteName || 'unknown';
      this.metrics.trackPage({ page, title });
    });
  }

  beforeModel(/* transition */) {
    this.notifications.setDefaultAutoClear(true);
    this.notifications.setDefaultClearDuration(5200);

    this.titleService.start();

    let jobs = {};
    jobs.locales = this.getLocalesFromHost();

    // this.addPaypalSDK();
    return hash(jobs);
  }

  model() {
    return hash({
      loadedSettings: this.currentUser.load(),
      minimumLoadingDelay: new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
    });
  }

  afterModel() {
    let intl = this.intl;

    intl.setLocale(
      [this.settings.data.defaultLocale || 'en-us']
    );

    if (this.settings.systemSettings) {
      document.title = this.settings.systemSettings.siteName + ' | ' + document.title;
    }

    this.interface.initInterface();
  }

  /**
   * Get locales from host
   *
   */
  getLocalesFromHost() {
    const ENV = getOwner(this).resolveRegistration('config:environment');

    let rg1 = new RegExp('{{', 'g');
    let rg2 = new RegExp('}}', 'g');

    const url = `${ENV.API_HOST}/i18n/get-all-locales`;

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data && data.locales) {
          // load locales with ember-i18n
          for (let name in data.locales) {

            let langLocs = data.locales[name];

            for (let s in langLocs) {
              if (!langLocs[s]) continue;

              if (langLocs[s].indexOf('{{') > -1) {
                langLocs[s] = langLocs[s]
                  .replace(rg1, '{')
                  .replace(rg2, '}');
              }

              // langLocs[s] = langLocs[s].replace(/'/g, '\'');

              langLocs[s] = langLocs[s].replace(/'>/g, '\' >');

              if (langLocs[s].indexOf('<') > -1) {
                langLocs[s] = langLocs[s].replace(/</g, '\'<\'');
                delete langLocs[s];
              }

              if (langLocs[s] && langLocs[s].indexOf('>') > -1) {
                langLocs[s] = langLocs[s].replace(/>/g, '\'>\'');
              }
            }

            this.intl.addTranslations(name, data.locales[name]);
          }
        }
      });
  }
}
