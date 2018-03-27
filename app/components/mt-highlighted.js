import Ember from 'ember';

export default Ember.Component.extend({
  notifications: Ember.inject.service('notification-messages'),

  cantDecrease: Ember.computed.not('record.highlighted'),

  actions: {
    increaseHighlighted(record) {
      let currentValue = (Ember.get(record, 'highlighted') || 0);

      Ember.set(record, 'highlighted', currentValue+1);

      record.save().then( ()=> {
        this.get('notifications').success('Prioridade de exibição aumentada.', {
          autoClear: true,
          clearDuration: 900
        });
        return null;
      });
    },
    decreaseHighlighted(record) {
      let currentValue = (Ember.get(record, 'highlighted') || 0);

      if (!currentValue) {
        return;
      }

      Ember.set(record, 'highlighted', currentValue-1);

      record.save().then( ()=> {
        this.get('notifications').success('Prioridade de exibição reduzida.', {
          autoClear: true,
          clearDuration: 900
        });
        return null;
      });
    }
  }
});
