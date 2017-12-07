import Ember from 'ember';
import EmberFlatpickr from 'ember-flatpickr/components/ember-flatpickr';

export default EmberFlatpickr.extend({
  init: function() {
    const defaults = {
      altFormat: 'j/n/Y H:i',
      enableSeconds: false,
      enableTime: true,
      allowInput: false,
      altInput: true,
      clickOpens: true,
      altInputClass: 'form-control',
      locale: 'pt',
      mode: 'single',
      nextArrow: '>',
      parseDate: false,
      placeholder: '',
      prevArrow: '<',
      static: false,
      // dateFormat: 'Z',
      // timeFormat: 'H:i',
      utc: false,
      wrap: false
    };

    Ember.setProperties(this.attrs, defaults);
    Ember.setProperties(this, defaults);

    this._super(...arguments);
  }
});