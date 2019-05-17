import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return {
      record: this.store.createRecord('vocabulary')
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('O vocabulário foi criado com sucesso.');

        this.transitionTo('vocabulary.index');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});