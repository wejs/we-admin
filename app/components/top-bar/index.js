import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TopBarComponent extends Component {
  @service session;
  @service interface;

  @action
  toggleSidebar() {
    this.interface.toggleSidebar();
  }
}
