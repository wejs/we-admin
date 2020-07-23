import Component from '@glimmer/component';
// import { action } from '@ember/object';
import { oneWay } from '@ember/object/computed';

export default class WeLoagingComponent extends Component {
  @oneWay('args.isWorking') isWorking;
}
