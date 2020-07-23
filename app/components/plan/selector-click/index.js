import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PlanSelectorComponent extends Component {
  @service store;

  @tracked isLoading = true;
  @tracked hasInitializationError = false
  @tracked selectedPlan = null;

  @tracked selectedPlanId = null;
  @not('selectedPlanId') hasSelectedPlanId;

  plans = null;

  constructor(owner, args) {
    super(owner, args);
    // load plans in async:
    this.loadPlans();
  }

  loadPlans() {
    this.store.findAll('subscription-plan')
    .then((results)=> {
      this.plans = results;
      this.isLoading = false;
      this.setDefaultSelectedItem();
    })
    .catch((err)=> {
      console.log(err);
      this.plans = [];
    });
  }

  setDefaultSelectedItem() {

  }

  @action
  onSelectPlanId(value) {
    if (this.args.onSelectPlanId) {
      this.args.onSelectPlanId(value);
    }
  }

  @action
  onClickInPlan(plan) {
    console.log('plan>>', plan);

    if (plan && plan.id) {
      this.selectedPlanId = plan.id;
      this.selectedPlan = plan;
    } else {
      this.selectedPlanId = null;
      this.selectedPlan = null;
    }
  }

  @action
  choiceSelectedPlan() {
    const plan = this.selectedPlan;

    if (plan && plan.id) {
      if (this.args.onSelectPlanId) {
        this.args.onSelectPlanId(plan.id);
      }
    } else {
      this.selectedPlanId = null;
    }
  }
}
