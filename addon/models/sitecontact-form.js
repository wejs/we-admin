import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  contactWithEmail: DS.attr('string'),
  emailBody: DS.attr('string'),
  successEmailBodyTemplate: DS.attr('string'),

  publishedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),

  linkPermanent: DS.attr('string')
});