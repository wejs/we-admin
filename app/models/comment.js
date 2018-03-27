import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  body: DS.attr('string'),
  teaser: Ember.computed('body', function() {
    const body = this.get('body');

    if (!body || !body.trim) {
      return '';
    }

    let teaser = body.trim();
    if (!teaser) {
      return '';
    }


    return trimText(removeTags(body), 150);
  }),
  published: DS.attr('boolean', {
    defaultValue: true
  }),
  modelName: DS.attr('string'),
  modelId: DS.attr('string'),

  creator: DS.belongsTo('user', {
    async: true
  }),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  publishedAt: DS.attr('date'),

  setAlias: DS.attr('string'),
  linkPermanent: DS.attr('string')
});

function removeTags(str) {
  return str.replace(/<{1}[^<>]{1,}>{1}/g," ");
}

function trimText(value, limit) {
  if (value != null && value.length > 0) {
    let text = value.substr(0, limit);

    if (value.length > limit) {
      text += '...';
    }

    return text;
  }

  return value;
}

