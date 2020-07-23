import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PlanSelectorComponent extends Component {
  @service store;

  @tracked isLoading = true;
  @tracked hasInitializationError = false
  @tracked selectedPlan = null;

  @alias('args.selectedPlanId') selectedPlanId;

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
    const selectedPlanId = this.args.selectedPlanId;

    if (
      selectedPlanId &&
      this.plans.length
    ) {
      const plan = this.plans.find((p)=> {
        return p.id === selectedPlanId;
      });

      if (!plan) {
        // invalid plan id
        this.onSelectPlanId(null);
      }

      this.selectedPlan = plan;
    } else if(this.plans.length) {
      // select default
      const plan = this.plans.objectAt(0);
      this.selectedPlan = plan;
      this.onSelectPlanId(plan.id);
    }
  }

  onSelectPlanId(value) {
    if (this.args.onSelectPlanId) {
      this.args.onSelectPlanId(value);
    }
  }

  @action
  onChangePlan(plan) {
    this.selectedPlan = plan;
    if (plan) {
      this.onSelectPlanId(plan.id);
    } else {
      this.onSelectPlanId(null);
    }
  }
}
