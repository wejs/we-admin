import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { Promise, hash } from 'rsvp';
import $ from 'jquery';
import { set } from '@ember/object';

import { getOwner } from '@ember/application';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      emailTypes: this.getEmailTypes()
    });
  },

  getEmailTypes() {
    return new Promise( (resolve, reject)=> {
      let headers = { Accept: 'application/vnd.api+json' };

      const ENV = getOwner(this).resolveRegistration('config:environment');

      $.ajax({
        url: `${ENV.API_HOST}/email-template-type`,
        type: 'GET',
        headers: headers
      })
      .done( (r)=> {
        resolve(r.emailTypes);
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
