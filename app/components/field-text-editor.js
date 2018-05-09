import Ember from 'ember';

let ENV,editorLocaleCache, editorLocaleUrlCache;

export default Ember.Component.extend({
  classNames: ['field-text-editor'],

  settings: Ember.inject.service('settings'),
  upload: Ember.inject.service('upload'),

  label: null,
  value: null,

  init() {
    this._super(...arguments);
    ENV = Ember.getOwner(this).resolveRegistration('config:environment');
    this.set('ENV', ENV);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (!this.get('editorOptions')) {
      this.set('editorOptions', this.getBigEditor());
    }
  },

  actions: {
    onSearch(term) {
      return this.search(term);
    }
  },

  getBigEditor() {
    return {
      min_height: 400,
      theme: 'modern',
      convert_urls: false,
      branding: false,

      theme_advanced_buttons3_add : "pastetext,pasteword,selectall",
      paste_auto_cleanup_on_paste : true,

      extended_valid_elements: 'iframe[src|frameborder|style|scrolling|class|width|height|name|align]',
      plugins: [
        'advlist autolink lists link image charmap print hr anchor',
        'searchreplace visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking save table contextmenu directionality',
        'emoticons paste textcolor colorpicker textpattern codesample'
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | fullscreen',
      language: this.getEditorLocale(),
      language_url: this.getEditorLocaleUrl(),

      image_description: true,
      image_caption: true,
      image_advtab: true,
      file_browser_callback_types: 'image',
      file_picker_callback: this.get('upload').get_file_picker_callback(),

      // imagetools_toolbar: 'rotateleft rotateright | imageoptions',

      // style_formats: [
      //   {
      //     title: 'Image Left',
      //     selector: 'img',
      //     styles: {
      //       'float' : 'left',
      //       'margin': '0 10px 0 10px'
      //     }
      //   },
      //   {
      //     title: 'Image Right',
      //     selector: 'img',
      //     styles: {
      //       'float' : 'right',
      //       'margin': '0 10px 0 10px'
      //     }
      //   }
      // ]
    };
  },

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
  }
});