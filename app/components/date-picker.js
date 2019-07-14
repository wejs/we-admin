import EmberFlatpickr from 'ember-flatpickr/components/ember-flatpickr';
import { get } from '@ember/object';
import { setProperties } from '@ember/object';

export default EmberFlatpickr.extend({
  init() {
    const defaults = {
      altFormat: 'j/n/Y',
      enableSeconds: false,
      enableTime: false,
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
      wrap: false,
      date: get(this, 'date') || new Date()
    };

    setProperties(this.attrs, defaults);
    setProperties(this, defaults);

    this._super(...arguments);
  }
});