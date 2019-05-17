import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import { hash } from 'rsvp';
import { get } from '@ember/object';
import { getOwner } from '@ember/application';
import $ from 'jquery';

export default Route.extend(AuthenticatedRouteMixin, {
  session: inject('session'),
  acl: inject('acl'),

  model() {
    let parentModel = this.modelFor('menus.item');

    return hash({
      menuId: parentModel.menuId,
      menu: parentModel.record,
      record: this.store.createRecord('link'),
      selectedLinkType: null,
      selectedPage: null,
      pageRecord: this.store.createRecord('content', {
        published: true
      }),
      linkTypes: [
        {
          id: 'toURL',
          text: 'Digitar uma url'
        },
        {
          id: 'selectPage',
          text: 'Selecionar uma página existente'
        },
        {
          id: 'createPage',
          text: 'Criar uma nova página'
        }
      ],
      userRoles: this.get('acl').getRolesArray()
    });
  },

  afterModel(model) {
    model.userRoles.unshift({
      id: null,
      name: 'Público'
    });
  },

  actions: {
    saveLink(link) {
      let menu = this.get('currentModel.menu');
      link.set('menu', menu);

      let linkType = this.get('currentModel.selectedLinkType.id');

      if (
        linkType === 'createPage'
      ) {
        let page = this.get('currentModel.pageRecord');
        // save page before save the link:
        return this.savePage(page)
        .then( (page)=> {
          link.href = get(page, 'linkPermanent');
          this.saveRecord(link, menu);
          return null;
        })
        .catch( (err)=> {
          this.send('queryError', err);
          return null;
        });
      } else if (linkType === 'selectPage') {
        let linkPermanent = this.get('currentModel.selectedPage.linkPermanent');

        if (!linkPermanent) {
          this.get('notifications').warning('Selecione uma página antes de salvar.');
          return null;
        }

        link.href = linkPermanent;
        return this.saveRecord(link, menu);
      } else if (linkType === 'toURL') {
        return this.saveRecord(link, menu);
      }
    }
  },

  saveRecord(link, menu) {
    link
    .save()
    .then( (r)=> {
      this.get('notifications').success('Link salvo');
      // move scroll to top:
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      const menuItemModel = this.modelFor('menus.item');

      menuItemModel.links.links.unshift(link);

      this.transitionTo('/menus/'+menu.id);

      return r;
    });
  },

  savePage(record) {
    return record.save()
    .then( (r)=> {
      this.get('notifications').success(`Página "${r.get('title')}" salva.`);
      // success, return the page record
      return r;
    });
  },

  /**
   * Method to check if one link have an page to load
   *
   * @param  {String} url link url
   * @return {Promise}
   */
  checkIfHaveOnePage(url) {
    return new window.Promise( (resolve, reject)=> {
      const ENV = getOwner(this).resolveRegistration('config:environment');

      let headers = { Accept: 'application/vnd.api+json' },
          accessToken = this.get('session.session.authenticated.access_token');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      if (url[0] !== '/') {
        url = '/' + url;
      }

      $.ajax({
        url: `${ENV.API_HOST}${url}`,
        type: 'GET',
        headers: headers
      })
      .done( ()=> {
        // page exists, do nothing
        resolve(false);
        return null;
      })
      .fail( (err, textStatus)=> {
        if (textStatus === '404') {
          // this page dont exists ...
          if (confirm('O endereço desse link não possuí uma página ou link disponível. '+
            '\nVocê gostaria de criar uma página e associar com o link?')) {
            // create one page ...
            resolve(true);
          } else {
            // user dont want create one page for this link:
            resolve(false);
          }
        } else {
          // unknow error:
          reject(err);
        }
      });
    });
  }

});