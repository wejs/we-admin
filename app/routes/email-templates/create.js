import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

import { get, set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  queryParams: {
    type: {
      refreshModel: true
    }
  },
  model(params) {
    const emailTypes = this.modelFor('email-templates').emailTypes;

    return hash({
      emailTypes: this.getEmailTypesArray(),
      selectedEmailType: emailTypes[params.type],
      allowChangeType: !params.type,
      record: this.store.createRecord('email-template')
    });
  },

  afterModel(model) {
    const selectedEmailType = get(model, 'selectedEmailType');

    const tid = selectedEmailType.id;
    if (tid) {
      set(model, 'record.type', tid);
    }

    set(model.record, 'subject', selectedEmailType.defaultSubject);
    set(model.record, 'text', selectedEmailType.defaultText);
    set(model.record, 'html', selectedEmailType.defaultHTML);
  },

  getEmailTypesArray() {
   const emailTypes = this.modelFor('email-templates').emailTypes;
    let emailTypesArray = [];

    for (let name in emailTypes) {
      if (!emailTypes[name].id) {
        set(emailTypes[name], 'id', name);
      }
      emailTypesArray.push(emailTypes[name]);
    }

    return emailTypesArray;
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Template adicionado com sucesso.');

        this.transitionTo('email-templates.item', r.id);
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