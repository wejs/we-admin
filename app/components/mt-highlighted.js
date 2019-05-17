import Component from '@ember/component';
import { inject } from '@ember/service';
import { get, set } from '@ember/object';
import { not } from '@ember/object/computed';

export default Component.extend({
  notifications: inject('notification-messages'),

  cantDecrease: not('record.highlighted'),

  actions: {
    increaseHighlighted(record) {
      let currentValue = (get(record, 'highlighted') || 0);

      set(record, 'highlighted', currentValue+1);

      record.save().then( ()=> {
        this.get('notifications').success('Prioridade de exibição aumentada.', {
          autoClear: true,
          clearDuration: 900
        });
        return null;
      });
    },
    decreaseHighlighted(record) {
      let currentValue = (get(record, 'highlighted') || 0);

      if (!currentValue) {
        return;
      }

      set(record, 'highlighted', currentValue-1);

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
