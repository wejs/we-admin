import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default class WeSidebarBrandComponent extends Component {
  @service settings;

  @computed('settings.systemSettings', 'settings.data.appName')
  get siteName () {
    if (
      this.settings.systemSettings &&
      this.settings.systemSettings.siteName
    ) {
      return this.settings.systemSettings.siteName;
    }

    return this.settings.data.appName;
  }

  @computed (
    'settings.systemSettings.logoUrlOriginal',
    'settings.data.hostname'
  )
  get logoURL() {
    const hostname = this.settings.data.hostname;

    if (this.settings.systemSettings && this.settings.systemSettings.logoUrlOriginal) {
      return hostname + this.settings.systemSettings.logoUrlOriginal;
    }
    return null;
  }
}