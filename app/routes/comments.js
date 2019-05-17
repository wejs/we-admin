import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Dados salvos.');
        // move scroll to top:
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return err;
      });
    },
    deleteRecord(record) {
      if (confirm(`Tem certeza que deseja deletar o comentário #"${record.get('id')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`O comentário #"${record.get('id')}" foi deletado.`);
          this.transitionTo('comments.index');
          return null;
        });
      }
    }
  }
});
