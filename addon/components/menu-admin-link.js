import Ember from 'ember';
import layout from '../templates/components/menu-admin-link';

export default Ember.Component.extend({
  layout,

  tagName: 'li',
  // classNames: ['haveSubmenu:dropdown'],
  // link: null,
  // haveSubmenu: Ember.computed('link.links', function() {
  //   return Boolean(this.get('link.links'));
  // })
});
