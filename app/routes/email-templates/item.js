import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const get = Ember.get;
const set = Ember.set;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return Ember.RSVP.hash({
      emailTypes: this.getEmailTypesArray(),
      selectedEmailType: null,
      record: this.get('store').findRecord('email-template', params.id)
    });
  },
  afterModel(model) {
    const type = get(model, 'record.type');

    if (type) {
      const emailTypes = this.modelFor('email-templates').emailTypes;
      set(model, 'selectedEmailType', emailTypes[type]);
    }
  },

  getEmailTypesArray() {
   const emailTypes = this.modelFor('email-templates').emailTypes;
    let emailTypesArray = [];

    for (let name in emailTypes) {
      if (!emailTypes[name].id) {
        set(emailTypes[name], 'id', name);
      }

      emailTypesArray.push(emailTypes[name]);
    }

    return emailTypesArray;
  }
});