import Ember from 'ember';

export default Ember.Component.extend({
  acl: Ember.inject.service('acl'),

  tagName: 'a',
  classNames: ['btn', 'btn-default'],

  goTo: 'goTo',

  model: null,

  isVisible: Ember.computed('model', function() {
    return Boolean(this.get('acl').can('create_'+this.get('model')));
  }),

  click() {
    let url = this.get('url') || '/'+this.get('model')+'/create';

    this.sendAction('goTo', url);
  }
});