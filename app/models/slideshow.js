import DS from 'ember-data';
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;
inflector.irregular('slideshow', 'slideshow');
inflector.uncountable('slideshow');

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  image: DS.attr('array'),
  linkPermanent: DS.attr(),
  metadata: DS.attr(),
  setAlias: DS.attr(),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  creator: DS.belongsTo('user', {
    async: true
  }),
  slides: DS.hasMany('slide', {
    async: true,
    inverse:'slideshow'
  })
});