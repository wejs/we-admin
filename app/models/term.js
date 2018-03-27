import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  description: DS.attr('string'),
  vocabularyName: DS.attr('string'),

  setAlias: DS.attr('string'),
  linkPermanent: DS.attr('string'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
