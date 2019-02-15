import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;
inflector.irregular('slide', 'slide');
inflector.uncountable('slide');

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  link: DS.attr('string'),
  linkText: DS.attr('string'),
  published: DS.attr('boolean'),
  publishedAt: DS.attr('date'),
  image: DS.attr('array'),
  linkPermanent: DS.attr(),
  metadata: DS.attr(),
  setAlias: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  creator: DS.belongsTo('user', {
    async: true
  }),
  slideshow: DS.belongsTo('slideshow', {
    async: true,
    inverse:'slides'
  })
});