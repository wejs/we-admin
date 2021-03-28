import Component from '@glimmer/component';
// import { inject as service } from '@ember/service';
// import { action } from '@ember/object';
// import { oneWay } from '@ember/object/computed';
// import { set, action } from '@ember/object';
import { computed } from '@ember/object';

export default class UIRenderCurrencyComponent extends Component {
  @computed('args.value')
  get result() {
    let value = this.args.value;
    if (value || value === 0) {
      let formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      return formatter.format(value);
    }

    return '';
  }
}