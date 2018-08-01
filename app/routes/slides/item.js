import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    const slideshow = this.modelFor('slides').slideshow;

    return Ember.RSVP.hash({
      record: this.get('store').findRecord('slide', params.id),
      slideshow: slideshow
    });
  }
});