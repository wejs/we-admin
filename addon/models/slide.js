import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  highlighted: DS.attr('number', {
    defaultValue: 0
  }),
  description: DS.attr('string'),
  link: DS.attr('string'),
  linkText: DS.attr('string'),
  published: DS.attr('boolean', {
    defaultValue: true
  }),
  publishedAt: DS.attr('date'),
  slideshowId: DS.attr('string', {
    defaultValue: 1
  }),
  creator: DS.belongsTo('user', {
    inverse: 'slides'
  }),
  image: DS.attr('array')
});