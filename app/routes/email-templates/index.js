import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { set } from '@ember/object';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return hash({
      emailTypes: this.getEmailTypesArray(),
      // records: this.get('store').query('email-template', {}),
      columns: [
        {
          propertyName: 'id',
          title: 'ID',
          className: 'mt-c-id'
        },
        {
          propertyName: 'subject',
          filteredBy: 'subject',
          title: 'Asunto',
          className: 'mt-c-subject text-cell'
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          title: 'Criado em',
          component: 'mt-list-item-created-at',
          className: 'mt-c-createdAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: 'Ações',
          component: 'mt-actions-email-templates'
        }
      ]
    });
  },

  afterModel(model) {
    model.emailTypes.forEach((et)=> {
      const p = this.get('store').query('email-template', {
        type: et.id
      })
      .then((r)=> {
        if (r && r.get('firstObject')) {
          set(et, 'emailTemplate', r.get('firstObject'));
          return r.get('firstObject');
        }
      });

      set(et, 'emailTemplate', p);
    });
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
  }
});
