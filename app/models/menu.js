import DS from 'ember-data';
// import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  label: DS.attr('string', {
    defaultValue: 'TODO!'
  }),
  description: DS.attr('string'),
  class: DS.attr('string'),
  sorted: DS.attr('boolean'),
  links: DS.hasMany('link', {
    inverse: 'menu',
    async: true
  }),
  linkPermanent: DS.attr('string'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});