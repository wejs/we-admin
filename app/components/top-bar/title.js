import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { set } from '@ember/object';

export default class TopBarTitleComponent extends Component {
  @service router;

  title = '';
  envConfig =  null;

  constructor () {
    super(...arguments);

    this.envConfig = getOwner(this).resolveRegistration('config:environment');
    this.updateRoute();

    this.router.on('routeDidChange', () => {
      this.updateRoute();
    })
  }

  updateRoute() {
    const owner = getOwner(this);
    const n = 'route:' + this.router.currentRoute.name.replace(/\./gi, '/')
    const route = owner.lookup(n);

    const titleCfg = this.envConfig.title;

    let title = '';

    if (route.title) {
      title = route.title;
    } else if (titleCfg && titleCfg.default) {
      title = titleCfg.default;
    } else {
      title = 'Admin';
    }

    set(this, 'title', title);

    if (titleCfg.updateBrowserTitle) {
      if (route.title) {
        document.title = (titleCfg.prefix || '') + title + (titleCfg.sufix || '');
      } else {
        document.title = title;
      }
    }
  }
}
