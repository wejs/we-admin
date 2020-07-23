import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default class WeSidebarComponent extends Component {
  @service interface;

  get adminMenu() {
    const env = getOwner(this).resolveRegistration('config:environment');
    return env.adminMenu || [];
  }

  @computed('interface.sidebarIsOpen')
  get listClass() {
    if (this.interface.sidebarIsOpen) {
      return 'navbar-nav bg-gradient-primary sidebar sidebar-dark sidebar-edulinky accordion';
    } else {
      return 'navbar-nav bg-gradient-primary sidebar sidebar-dark sidebar-edulinky accordion toggled';
    }
  }

  @action
  toggleSidebar() {
    this.interface.toggleSidebar();
  }
}

// "navbar-nav bg-gradient-primary sidebar sidebar-dark sidebar-edulinky accordion"
