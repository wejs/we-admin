import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    const slideshow = this.modelFor('slides').slideshow;
    return hash({
      record: this.store.createRecord('slide', {
        slideshow: slideshow
      }),
      slideshow: slideshow
    });
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Slide adicionado com sucesso.');

        this.transitionTo('slides.item', r.id);
        this.send('scrollToTop');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return null;
      });
    }
  }
});