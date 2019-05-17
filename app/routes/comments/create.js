import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return {
      record: this.get('store').createRecord('comment')
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Comentário adicionado com sucesso.');

        this.transitionTo('/comments/'+ r.id);
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