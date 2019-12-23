// in v3

import Component from '@ember/component';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  acl: inject('acl'),

  tagName: 'a',
  classNames: ['btn', 'btn-default'],

  goTo: 'goTo',

  model: null,

  isVisible: computed('model', function() {
    return Boolean(this.get('acl').can('create_'+this.get('model')));
  }),

  click() {
    let url = this.get('url') || '/'+this.get('model')+'/create';

    this.sendAction('goTo', url);
  }
});