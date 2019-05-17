import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    const slideshow = this.modelFor('slides').slideshow;

    return hash({
      record: this.get('store').findRecord('slide', params.id),
      slideshow: slideshow
    });
  }
});