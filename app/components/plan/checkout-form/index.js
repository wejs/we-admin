import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
// import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { copy } from 'ember-copy';
import { computed } from '@ember/object';

export default class PlanCheckoutFormComponent extends Component {
  @service session;
  @service settings;

  @alias('args.posting') posting;
  @alias('args.values') values;

  @alias('args.selectedPlanId') selectedPlanId;
  // @not('selectedPlanId') disabled;

  @computed('selectedPlanId', 'posting')
  get disabled() {
    return ( !this.selectedPlanId || this.posting);
  }

  @action
  submitSubscribeForm() {
    let data = copy(this.values);
    data.planId = this.selectedPlanId;

    if (this.args.submitSubscribeForm) {
      this.args.submitSubscribeForm(data);
    }
  }

  @action
  onUpdateCPF(unmasked) {
    this.values.cpf = unmasked;
  }

  @action
  onUpdateZip(unmasked) {
    this.values.zip = unmasked;
  }
}
