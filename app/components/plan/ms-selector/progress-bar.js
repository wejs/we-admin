import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { copy } from '@ember/object/internals';

// import { alias } from '@ember/object/computed';
// import { tracked } from '@glimmer/tracking';
// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';

export default class MSProgressBarComponent extends Component {
  @computed('args.{steps.length,currentStep}')
  get steps() {
    let steps = copy(this.args.steps, true);
    let currentStep = this.args.currentStep;
    let currentStepName = currentStep.name;
    let stepFound = false;

    if (currentStepName) {
      for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        if (step.name == currentStepName) {
          step.active = true;
          stepFound = true;
        } else if (stepFound) {
          step.active = false;
          step.done = false;
        } else {
          step.active = false;
          step.done = true;
        }
      }
    }

    return steps;
  }
}
