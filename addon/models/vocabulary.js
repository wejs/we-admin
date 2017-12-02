import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  creator: DS.belongsTo('user'),
  linkPermanent: DS.attr('string'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});