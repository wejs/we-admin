import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { set } from '@ember/object';
import { oneWay } from '@ember/object/computed';

export default class TopBarTitleComponent extends Component {
  @service('title') titleService;
  @oneWay('titleService.title') title;
}
