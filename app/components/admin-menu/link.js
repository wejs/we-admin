import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { computed, action } from '@ember/object';

export default class AdminMenuLinkComponent extends Component {
  @service currentUser;
  @service interface;
  @service router;

  @oneWay('args.link') link;

  @computed('link', 'currentUser.user.roles.[]')
  get isVisible() {
    const roles = this.currentUser.user.roles;
    const link = this.link;

    if (link.public) {
      return true;
    }

    if (link.role) {
      if (roles.indexOf(link.role) > -1) {
        return true;
      }
    }

    if (link.roles) {
      for (let i = 0; i < link.roles.length; i++) {
        const role = link.roles[i];
        if (roles.indexOf(role) > -1) {
          return true;
        }
      }
    }

    if (roles.indexOf('administrator') > -1) {
      return true;
    }

    return false;
  }

  @computed('link.type')
  get type() {
    if (
      !this.link ||
      !this.link.type ||
      (this.link.type == 'link')
    ) {
      return 'link';
    }

    return this.link.type
  }

  @action
  closeSideMenu() {
    if (this.canToggleMenu()) {
      this.interface.closeSidebar();
    }
  }

  @action
  goTo(event) {
    event.preventDefault();
    this.router.transitionTo(this.link.linkTo);
    this.closeSideMenu();
    return false;
  }

  canToggleMenu() {
    return (window.outerWidth < 768);
  }
}
