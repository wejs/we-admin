import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  text: DS.attr('string'),
  css: DS.attr('string'),
  html: DS.attr('string'),
  type: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});