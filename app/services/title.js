import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { set } from '@ember/object';

export default class TitleService extends Service {
  @service router;

  title = '';

  start() {
    this.envConfig = getOwner(this).resolveRegistration('config:environment');
    this.updateRoute();

    this.router.on('routeDidChange', () => {
      this.updateRoute();
    });
  }

  updateRoute() {
    const route = this.getRoute();

    const titleCfg = this.envConfig.title;

    let title = '';

    if (route && route.title) {
      title = route.title;
    } else if (titleCfg && titleCfg.default) {
      title = titleCfg.default;
    } else {
      title = 'Admin';
    }

    set(this, 'title', title);

    if (titleCfg.updateBrowserTitle) {
      if (route && route.title) {
        document.title = (titleCfg.prefix || '') + title + (titleCfg.sufix || '');
      } else {
        document.title = title;
      }
    }
  }

  getRoute() {
    const owner = getOwner(this);

    if (!this.router.currentRoute) {
      return null;
    }

    const n = 'route:' + this.router.currentRoute.name.replace(/\./gi, '/')
    const route = owner.lookup(n);

    return route;
  }
}
