import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['field-role-selector'],

  selected: null,

  placeholder: null,

  roles: null,
  value: null,

  init() {
    this._super(...arguments);
    this.set('ENV', Ember.getOwner(this).resolveRegistration('config:environment'));

    const roles = this.get('roles');
    const value = this.get('value');
    if (roles && roles.length && value) {
      if (value) {
        for (let i = roles.length - 1; i >= 0; i--) {
          if (roles[i].id === value) {
            this.set('selected', roles[i]);
            break;
          }
        }
      }

    }
  },

  actions: {
    setLinkUserRole(selected) {
      if (selected && selected.id) {
        this.set('selected', selected);
        this.set('value', selected.id);
      } else {
        this.set('selected', null);
        this.set('value', null);
      }
    }
  },
});