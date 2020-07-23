import Transform from '@ember-data/serializer/transform';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default class ArrayTransform extends Transform {
  deserialize(serialized) {
    return (typeOf(serialized) === "array") ? A(serialized): A();
  }

  serialize(deserialized) {
    let type = typeOf(deserialized);
    if (type === 'array') {
      return A(deserialized);
    } else if (type === 'string') {
      return A(deserialized.split(',').map(function (item) {
        if (item && item.trim) {
          return item.trim();
        }

        return item;
      }));
    } else {
      return A();
    }
  }
}
