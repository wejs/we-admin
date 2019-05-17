import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),
  acl: inject('acl'),

  model(params) {
    let parentModel = this.modelFor('menus.item');

    return hash({
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