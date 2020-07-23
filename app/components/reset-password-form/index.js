import Component from '@glimmer/component';
// import { computed } from '@ember/object';
// import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class ResetPasswordFormComponent extends Component {
  @inject accounts;

  @tracked values = null;

  constructor(owner, args) {
    super(owner, args);

    if (this.args.values) {
      this.values = this.args.values;
    } else {
      this.values = {
        email: ''
      };
    }
  }

  @action
  submitForm() {
    if (!this.values.email) return;

    this.accounts.resetPassword({
      email: this.values.email
    })
    .then((r)=> {
      console.log('resetPassword', r);
    })
    .catch((err)=> {
      console.log('err>', err);
    });
  }

}
