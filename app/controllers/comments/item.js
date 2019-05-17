import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

let editorLocaleCache, editorLocaleUrlCache;

export default Controller.extend({
  ajax: inject(),
  session: inject('session'),
  settings: inject('settings'),
  upload: inject('upload'),

  queryParams: ['type'],

  editorOptions: computed('settings.data', {
    get() {
      const opts = {
        min_height: 300,
        theme: 'modern',
        convert_urls: false,
        branding: false,
        plugins: [
          'legacyoutput advlist autolink lists link image charmap hr anchor pagebreak',
          'searchreplace wordcount visualblocks visualchars code fullscreen',
          'insertdatetime nonbreaking save table contextmenu directionality',
          'emoticons paste textcolor colorpicker textpattern codesample'
        ],
        toolbar1: 'undo redo | insert | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image |  codesample',
        language: this.getEditorLocale(),
        language_url: this.getEditorLocaleUrl(),
        file_browser_callback_types: 'image',
        file_picker_callback: this.get('upload').get_file_picker_callback()
      };

      return opts;
    }
  }),

  getEditorLocale() {
    if (editorLocaleCache) {
      return editorLocaleCache;
    }

    let locale = this.get('settings.data.activeLocale');
    // use default en-us locale
    if (!locale || locale === 'en' || locale === 'en-us') {
      return null;
    }

    if (locale.indexOf('-') > -1) {
      const parts = locale.split('-');
      // Locales with more than 2 parts not are supported
      // TODO!
      if (parts.length > 2) {
        return null;
      }
      // Converts the seccond part of the locale to uppercase:
      parts[1] = parts[1].toUpperCase();
      // override the locale?
      locale = parts.join('_');
    } else {
      return null;
    }

    editorLocaleCache = locale;

    return editorLocaleCache;
  },

  getEditorLocaleUrl() {
    if (editorLocaleUrlCache) {
      return editorLocaleUrlCache;
    }

    let locale = this.get('settings.data.activeLocale');
    // use default en-us locale
    if (!locale || locale === 'en' || locale === 'en-us') {
      return null;
    }

    if (locale.indexOf('-') > -1) {
      const parts = locale.split('-');
      // Locales with more than 2 parts not are supported
      // TODO!
      if (parts.length > 2) {
        return null;
      }
      // Converts the seccond part of the locale to uppercase:
      parts[1] = parts[1].toUpperCase();
      // override the locale?
      locale = parts.join('_');
    } else {
      return null;
    }

    editorLocaleUrlCache = `/admin/tiny-mce-languages/${locale}.js`;

    return editorLocaleUrlCache;
  },
  actions: {
    changeDate(record, field, dates) {
      if (!dates || !dates[0]) {
        return;
      }
      this.get('model.record').set(field, dates[0]);
    }
  }
});
