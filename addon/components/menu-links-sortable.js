import Ember from 'ember';
import layout from '../templates/components/menu-links-sortable';

export default Ember.Component.extend({
  layout,
  classNames : ['nestedItem'],

  item          : undefined,
  dragEndAction : undefined,
  group         : 'menu'
});