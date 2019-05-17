import DS from 'ember-data';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';
import $ from 'jquery';

export default DS.Transform.extend({
  deserialize(serialized) {
    return (typeOf(serialized) === "array") ? A(serialized): A();
  },

  serialize(deserialized) {
    let type = typeOf(deserialized);
    if (type === 'array') {
      return A(deserialized);
    } else if (type === 'string') {
      return A(deserialized.split(',').map(function (item) {
          return $.trim(item);
      }));
    } else {
      return A();
    }
  }
});