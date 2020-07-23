import Component from '@glimmer/component';
import { computed } from '@ember/object';
// import { alias } from '@ember/object/computed';
// import { tracked } from '@glimmer/tracking';
// import { action } from '@ember/object';
// import { inject as service } from '@ember/service';

export default class MSProgressBarItemComponent extends Component {
  @computed('args.step.{active,done}')
  get liClass() {
    if (!this.args.step) return '';

    if (this.args.step.done) {
      return 'done';
    }

    if (this.args.step.active) {
      return 'active';
    }

    return '';
  }
}
