import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    onChangeMenuComponent(newV) {
      Ember.set(this, 'model.selectedMenuComponent', newV);
    }
  }
});