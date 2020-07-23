import Component from '@glimmer/component';
import { alias, oneWay, not } from '@ember/object/computed';
// import { tracked } from '@glimmer/tracking';
import { computed, action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MSComponent extends Component {
  @service settings;

  @oneWay('args.steps') steps;
  @alias('args.selectedPlanId') selectedPlanId;

  @oneWay('args.currentStepName') currentStepName;
  @oneWay('args.selectedProject') selectedProject;
  @oneWay('args.projectSubscriptionData') projectSubscriptionData;

  @not('args.selectedPlanId') hasSelectedPlanId;

  @computed('currentStepName', 'steps.length')
  get currentStep() {
    const steps = this.steps;
    const currentStepName = this.currentStepName;

    if (!steps) {
      return null;
    }

    let currentStep = steps.objectAt(0);

    if (currentStepName) {
      for (var i = 0; i < this.steps.length; i++) {

        let step = this.steps[i];
        if (step.name == currentStepName) {
          currentStep = step;
        }
      }
    }

    return currentStep;
  }

  constructor(owner, args) {
    super(owner, args);
  }

  @action
  onSubmitProject(project) {
    this.args.onSubmitProject(project);
  }

  @action
  onSelectPlanId(id) {
    if (this.args.onSelectPlanId) {
      this.args.onSelectPlanId(id);
    }
  }

  @action
  onSubmitSubscribeForm(data) {
    this.args.onSubmitSubscribeForm(data);
  }
}
