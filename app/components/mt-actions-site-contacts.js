import Component from '@ember/component';
export default Component.extend({
  actions: {
    changeStatus() {
      this.sendAction('changeStatus', ...arguments);
    }
  }
});
