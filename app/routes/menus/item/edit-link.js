import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),
  acl: Ember.inject.service('acl'),

  model(params) {
    let parentModel = this.modelFor('menus.item');

    return Ember.RSVP.hash({
      menuId: parentModel.menuId,
      menu: parentModel.record,
      record: this.get('store').findRecord('link', params.linkid),
      userRoles: this.get('acl').getRolesArray()
    });
  },
  afterModel(model) {
    model.userRoles.unshift({
      id: null,
      name: 'Público'
    });
  },
  actions: {
    saveLink(link) {
      let menuId = this.get('currentModel.menuId');

      link
      .save()
      .then( (r)=> {
        this.get('notifications').success('Link salvo');

        this.transitionTo('menus.item', menuId);
        return r;
      });
    }
  }

});