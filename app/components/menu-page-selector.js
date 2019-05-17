import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject(),

  addLink: 'addLink',

  isLoading: true,

  selectedPage: null,
  pagesSelected: null,
  havePagesSelected: false,

  recentPages: null,

  didInsertElement() {
    return this.get('store').query('content', {
      limit: 8,
      order: 'publishedAt DESC'
    }).then( (recentPages)=> {
      this.set('recentPages', recentPages);
      this.set('isLoading', false);
      return null;
    })
    .catch(()=> {
      // TODO!
    });
  },

  actions: {
    searchPages(term) {
      return this.get('store').query('content', {
        'title_starts-with': term,
        limit: 10
      });
    },
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
      if (selectedPage && selectedPage.get('linkPermanent')) {
        let linkPermanent = selectedPage.get('linkPermanent');

        let link = this.get('store').createRecord('link', {
          text: selectedPage.get('title'),
          modelName: 'content',
          modelId: selectedPage.id,
          href: linkPermanent
        });

        this.sendAction('addLink', link);
        this.set('selectedPage', null);
      }
    },

    addPages() {
      const pagesSelected = this.get('pagesSelected');

      for (let id in pagesSelected) {
        let selectedPage = pagesSelected[id];
        let linkPermanent = selectedPage.get('linkPermanent');

        let link = this.get('store').createRecord('link', {
          text: selectedPage.get('title'),
          modelName: 'content',
          modelId: selectedPage.id,
          href: linkPermanent
        });

        this.sendAction('addLink', link);
        delete pagesSelected[id];
      }

      this.set('havePagesSelected', false);
      this.$('input[type=checkbox]').removeAttr('checked');
    }
  }
});
