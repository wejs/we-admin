import Component from '@glimmer/component';
// import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject } from '@ember/service';

export default class MSProgressBarComponent extends Component {
  @inject accounts;

  @alias('args.steps') steps;

  @tracked values = null;

  constructor(owner, args) {
    super(owner, args);

    if (this.args.values) {
      this.values = this.args.values;
    } else {
      this.values = {
        fullName: 'Alberto Souza',
        displayName: 'Alberto',
        email: 'contato@albertosouza.net',
        confirmEmail: 'contato@albertosouza.net',
        password: '321',
        confirmPassword: '321'
      };
    }
  }

  @action
  submitForm() {
    this.accounts.signup(this.values)
      .then((r)=> {
        console.log('signup', r);
      })
      .catch((err)=> {
        console.log('err>', err);
      })
  }
}
