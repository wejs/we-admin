import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { set } from '@ember/object';

let rg1 = new RegExp('{{', 'g');
let rg2 = new RegExp('}}', 'g');

export default Route.extend(AuthenticatedRouteMixin, {
  actions: {
    deleteRecord(record) {
      if (confirm(`Tem certeza que deseja deletar a tradução "${record.get('t')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`A tradução "${record.get('t')}" foi deletada.`);
          this.transitionTo('t.index');
          return null;
        });
      }
    },
    changePublishedStatus(record, status) {
      set(record, 'published', status);
      if (status) {
        set(record, 'publishedAt', new Date());
      } else {
        set(record, 'publishedAt', null);
      }

      record.save()
      .then( (r)=> {
        if (status) {
          this.get('notifications').success('Conteúdo publicado.');
        } else {
          this.get('notifications').success('Conteúdo despublicado.');
        }
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },
    save(record) {
      const i18n = this.get('i18n');

      record.save()
      .then( function updateLocale(r) {
        if (r && r.l) {

          let t = r.t;

          if (t && t.indexOf('{{') > -1) {
            t = t
              .replace(rg1, '{')
              .replace(rg2, '}');
          }

          i18n.addTranslations(r.l, {
            [r.s]: t
          });
        }

        return r;
      })
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
    }
  }
});