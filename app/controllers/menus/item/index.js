import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  actions: {
    onChangeMenuComponent(newV) {
      set(this, 'model.selectedMenuComponent', newV);
    }
  }
});