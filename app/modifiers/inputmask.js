import { modifier } from 'ember-modifier';
import Inputmask from 'inputmask';

export default modifier(function inputMask(element, params, hash) {
  new Inputmask(hash).mask(element);
});
