import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

import { inject as service } from '@ember/service';

export default class UserMenuComponent extends Component {
  @service session;
  @service settings;

  @alias('settings.user') user;
}
