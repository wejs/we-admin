import Ember from 'ember';

function truncateText(params, hash) {
  const [ value ] = params;
  const { limit } = hash;
  let text = '';

  if (value != null && value.length > 0) {
    text = value.substr(0, limit);

    if (value.length > limit) {
      text += '...';
    }
  }

  return text;
}

export default Ember.Helper.helper(truncateText);
