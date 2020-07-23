import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
// import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class PlanCardComponent extends Component {
  @alias('args.plan') plan;

  @computed('args.{plan.id,selectedPlanId}')
  get isSelected() {

    if (!this.args.plan || !this.args.selectedPlanId) {
      return false;
    }

    if (this.args.plan.id == this.args.selectedPlanId) {
      return true;
    }

    return false;
  }

  @action
  onSelectPlan() {
    if (this.args.onSelectPlan) {
      this.args.onSelectPlan(this.args.plan);
    }
  }
}
