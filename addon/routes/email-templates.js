import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const set = Ember.set;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return Ember.RSVP.hash({
      emailTypes: this.getEmailTypes()
    });
  },

  getEmailTypes() {
    return new window.Promise( (resolve, reject)=> {
      let headers = { Accept: 'application/vnd.api+json' };

      const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

      Ember.$.ajax({
        url: `${ENV.API_HOST}/email-template-type`,
        type: 'GET',
        headers: headers
      })
      .done( (r)=> {
        resolve(r.emailTypes);
        return null;
      })
      .fail(reject);
    });
  },
  actions: {
    resetDefaultValues(record, selectedEmailType) {
      set(record, 'subject', selectedEmailType.defaultSubject);
      set(record, 'text', selectedEmailType.defaultText);
      set(record, 'html', selectedEmailType.defaultHTML);
    },
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
      if (confirm(`Tem certeza que deseja deletar o template #"${record.get('id')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`O template #"${record.get('id')}" foi deletado.`);
          this.transitionTo('email-templates.index');
          return null;
        });
      }
    },
  }
});
