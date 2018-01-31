import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    deleteRecord(record) {
      if (confirm(`Tem certeza que deseja deletar o vocabulário "${record.get('title')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`O vocabulário "${record.get('title')}" foi deletado.`);
          this.transitionTo('vocabulary.index');
          return null;
        });
      }
    },

    save(record, alias) {
      record.save()
      .then( function saveAlias(content) {
        if (!alias) {
          return content;
        }
        alias.alias = record.setAlias;
        return content;
      })
      .then( (r)=> {
        this.get('notifications').success('Vocabulário salvo.');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    }
  }
});
