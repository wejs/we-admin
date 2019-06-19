import Component from '@ember/component';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';

let ENV,editorLocaleCache, editorLocaleUrlCache;

export default Component.extend({
  classNames: ['field-text-editor'],

  settings: inject('settings'),
  upload: inject('upload'),

  label: null,
  value: null,

  init() {
    this._super(...arguments);
    ENV = getOwner(this).resolveRegistration('config:environment');

    window.tinyMCE.baseURL = ENV.API_HOST+
        '/public/plugin/we-plugin-editor-tinymce/files';

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
    const ENV = this.get('ENV');

    return {
      content_css : ENV.API_HOST+
        '/public/plugin/we-plugin-editor-tinymce/files/tiny_mce.css',

      min_height: 400,
      theme: 'modern',
      theme_url: ENV.API_HOST+
        '/public/plugin/we-plugin-editor-tinymce/files/themes/modern/theme.min.js',
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

      image_class_list: [
        { title: 'None', value: '' },
        {
          title: 'Thumbnail',
          value: 'img-thumbnail'
        },
        {
          title: 'Thumbnail left',
          value: 'img-thumbnail left align-left'
        },
        {
          title: 'Thumbnail right',
          value: 'img-thumbnail right align-right'
        },
        {
          title: 'Thumbnail center',
          value: 'img-thumbnail left align-left'
        },
        {
          title: 'Rounded',
          value: 'rounded'
        },
        {
          title: 'Thumbnail left',
          value: 'rounded left align-left'
        },
        {
          title: 'Thumbnail right',
          value: 'rounded right align-right'
        },
        {
          title: 'Thumbnail center',
          value: 'rounded left align-left'
        },
      ],

      formats: {
        alignleft: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'left align-left',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            classes: 'left align-left',
            styles: { textAlign: 'left' },
            inherit: false,
            preview: false,
            defaultBlock: 'div'
          },
          {
            selector: 'img,table',
            classes: 'left align-left',
            collapsed: false,
            styles: { float: 'left' },
            preview: 'font-family font-size'
          }
        ],
        aligncenter: [
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'center' },
            classes: 'center align-center',
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div'
          },
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'center align-center',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'img',
            collapsed: false,
            styles: {
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            classes: 'center align-center',
            preview: false
          },
          {
            selector: 'table',
            collapsed: false,
            styles: {
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            classes: 'center align-center',
            preview: 'font-family font-size'
          }
        ],
        alignright: [
          {
            selector: 'figure.image',
            collapsed: false,
            classes: 'right align-right',
            ceFalseOverride: true,
            preview: 'font-family font-size'
          },
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'right' },
            classes: 'right align-right',
            inherit: false,
            preview: 'font-family font-size',
            defaultBlock: 'div'
          },
          {
            selector: 'img,table',
            collapsed: false,
            styles: { float: 'right' },
            classes: 'right align-right',
            preview: 'font-family font-size'
          }
        ],
        alignjustify: [
          {
            selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
            styles: { textAlign: 'justify' },
            inherit: false,
            defaultBlock: 'div',
            preview: 'font-family font-size',
            classes: 'justify align-justify'
          }
        ]
      },

      file_browser_callback_types: 'image',
      file_picker_callback: this.get('upload').get_file_picker_callback(),

      imagetools_toolbar: 'rotateleft rotateright | imageoptions'
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