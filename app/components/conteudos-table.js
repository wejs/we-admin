import { inject } from '@ember/service';
import { computed, get } from '@ember/object';
import EmberObject from '@ember/object';

import ServerModelsTable from 'ember-models-table/components/models-table-server-paginated';
import Bs3Theme from 'ember-models-table/themes/bootstrap3';


// ref https://github.com/onechiporenko/ember-models-table/blob/master/addon/components/models-table-server-paginated.js

export default ServerModelsTable.extend({
  i18n: inject(),
  /**
   * The property on meta to load the pages count from.
   *
   * @type {string}
   * @name metaPagesCountProperty
   */
  metaPagesCountProperty: 'count',
  /**
   * The property on meta to load the total item count from.
   *
   * @type {string}
   * @name metaItemsCountProperty
   */
  metaItemsCountProperty: 'count',


  /**
   * The pages count is get from the meta information.
   * Set metaPagesCountProperty to change from which meta property this is loaded.
   *
   * @type {number}
   * @name pagesCount
   */
  pagesCount: computed('filteredContent.meta', function () {
    let total = get(this, 'filteredContent.meta.count');
    let pageSize = get(this, 'pageSize');

    return Math.ceil(total/pageSize);
  }),

  showGlobalFilter: false,
  showColumnsDropdown: false,

  themeInstance: Bs3Theme.create(),

  actions: {
    deleteRecord(record) {
      this.sendAction('deleteRecord', record);
    },
    changePublishedStatus() {
      this.sendAction('changePublishedStatus', ...arguments);
    },
    changeStatus() {
      this.sendAction('changeStatus', ...arguments);
    }
  },

  init() {
    this._super();
    const i18n = this.get('i18n');
    this.set('themeInstance.messages', EmberObject.create({
      "searchLabel": i18n.t("models.table.search"),
      "searchPlaceholder": "",
      "columns-title": i18n.t("models.table.columns"),
      "columns-showAll": i18n.t("models.table.show.all"),
      "columns-hideAll": i18n.t("models.table.hide.all"),
      "columns-restoreDefaults": i18n.t("models.table.restore.defaults"),
      "tableSummary": String(i18n.t("models.table.restore.table.summary")),
      // "tableSummary": "Show %@ - %@ of %@",
      "allColumnsAreHidden": i18n.t('models.table.all.columns.are.hidden'),
      "noDataToShow": i18n.t('models.table.no.records.to.show')
    }));

    this.set('filterQueryParameters', {
      globalFilter: 'q',
      sort: 'sort',
      sortDirection: 'sortDirection',
      page: 'page',
      pageSize: 'limit'
    });
  }
});