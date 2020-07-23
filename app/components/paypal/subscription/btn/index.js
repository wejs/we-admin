import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import { action } from '@ember/object';

export default class PaypalSubscriptionBTNComponent extends Component {
  @service store;

  @tracked btnPlaceholderId = 'PaypalSubscriptionBTN';

  @oneWay('args.selectedPlanId') selectedPlanId;

  constructor(owner, args) {
    super(owner, args);
    this.renderPayBTN();
  }

  async renderPayBTN() {
    this.btnPlaceholderId = 'btn_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    let plan = this.store.peekRecord('subscription-plan', this.selectedPlanId);
    if (!plan) {
      plan = await this.store.findRecord('subscription-plan', this.selectedPlanId);
    }

    console.log('plan:', plan, plan.gatewayId);

    setTimeout(()=> {
      window.paypal.Buttons({
        createSubscription: function(data, actions) {
          return actions.subscription.create({
            'plan_id': plan.gatewayId
          });
        },

        onApprove: function(data, actions) {
          console.log('<<<<<<', data, actions);
          alert('You have successfully created subscription ' + data.subscriptionID);
        }
      })
      .render('#' + this.btnPlaceholderId);
    }, 20);
  }
  // paypal.Buttons().render('#testonildo');


}
