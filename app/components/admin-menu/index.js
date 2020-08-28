import Component from '@glimmer/component';
import { oneWay } from '@ember/object/computed';

export default class AdminMenuComponent extends Component {
  @oneWay('args.links') links;
}
