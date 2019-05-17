import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return {
      record: this.store.createRecord('url-alia')
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Url alternativo criado com sucesso.');

        this.transitionTo('url-alia.item', r.id);
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});