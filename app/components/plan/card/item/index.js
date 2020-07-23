import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
// import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';

export default class PlanItemComponent extends Component {
  @alias('args.included') included;
}
