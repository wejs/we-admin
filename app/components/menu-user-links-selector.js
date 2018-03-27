import Ember from 'ember';

const get = Ember.get;

export default Ember.Component.extend({
  store: Ember.inject.service(),

  addLink: 'addLink',

  selectedPage: null,
  pagesSelected: null,
  havePagesSelected: false,

  recentPages: null,

  options: [
    {
      id: 'view.profile',
      text: 'Ver perfil',
      role: 'authenticated',
      linkPermanent: '/user-goto?action=view'
    },
    {
      id: 'edit.profile',
      text: 'Editar perfil',
      role: 'authenticated',
      linkPermanent: '/user-goto?action=edit'
    },
    {
      id: 'edit.profile.privacity',
      text: 'Privacidade',
      role: 'authenticated',
      linkPermanent: '/user-goto?action=privacity'
    },
    {
      id: 'password.change',
      text: 'Mudar senha',
      role: 'authenticated',
      linkPermanent: '/auth/change-password'
    },
    {
      id: 'login',
      text: 'Entrar',
      role: 'unAuthenticated',
      linkPermanent: '/login'
    },
    {
      id: 'logout',
      text: 'Sair',
      role: 'authenticated',
      linkPermanent: '/logout'
    }
  ],

  actions: {
    selectPage(page) {
      this.set('selectedPage', page);
    },

    pageChecked(page) {
      let pagesSelected = this.get('pagesSelected');
      if (!pagesSelected) {
        pagesSelected = {};
        this.set('pagesSelected', pagesSelected);
      }
      // toggle page selection:
      if (pagesSelected[page.id]) {
        delete pagesSelected[page.id];
      } else {
        pagesSelected[page.id] = page;
      }

      this.set('havePagesSelected', Boolean(Object.keys(pagesSelected).length));
    },

    addPage() {
      let selectedPage = this.get('selectedPage');
      if (selectedPage && get(selectedPage, 'linkPermanent')) {
        let link = this.buildLink(selectedPage);
        this.sendAction('addLink', link);
        this.set('selectedPage', null);
      }
    },

    addPages() {
      const pagesSelected = this.get('pagesSelected');

      for (let id in pagesSelected) {
        let link;

        if (pagesSelected[id].isList) {
          link = this.buildListLink( pagesSelected[id] );
        } else {
          link = this.buildLink( pagesSelected[id] );
        }
        delete pagesSelected[id];
        this.sendAction('addLink', link);
      }

      this.set('havePagesSelected', false);
      this.$('input[type=checkbox]').removeAttr('checked');
    }
  },

  buildLink(selected) {
    let linkPermanent = get(selected, 'linkPermanent');

    let link = this.get('store').createRecord('link', {
      text: get(selected, 'text'),
      userRole: get(selected, 'role'),
      href: linkPermanent
    });

    return link;
  },

  buildListLink(selected) {
    let link = this.get('store').createRecord('link', {
      type: 'list',
      text: 'Usuários',
      href: get(selected, 'linkPermanent')
    });

    return link;
  }
});
