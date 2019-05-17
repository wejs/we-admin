import Component from '@ember/component';
export default Component.extend({
  actions: {
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
