import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  model(params) {
    return Ember.RSVP.hash({
      menuId: params.id,
      menuData: this.getLinks(params.id),
      record: null,
      sorted: false,
      editingRecord: null,
      tableDrag: null
    });
  },

  afterModel(model) {
    let linksFormated = model.menuData.link.map((link)=> {
      return {
        id: link.id,
        type: 'link',
        attributes: link,
        relationships: {
          menu: {
            data: {
              id: model.menuId,
              type: 'menu'
            }
          }
        }

      };
    });

    this.get('store').push({ data: linksFormated });

    model.record = this.get('store').findRecord('menu', model.menuId);

    return model.record;
  },

  getLinks(menuId) {
    const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

    return new window.Promise( (resolve, reject)=> {
      let headers = { Accept: 'application/json' },
          accessToken = this.get('session.session.authenticated.access_token');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      Ember.$.ajax({
        url: `${ENV.API_HOST}/link?menuId=${menuId}&order=depth ASC`,
        type: 'GET',
        headers: headers
      })
      .done(resolve)
      .fail(reject);
    });
  },

  getNewLinkRecord() {
    const link = this.get('store').createRecord('link');
    link.set('menu', this.get('currentModel.record'));
    return link;
  },

  reorderItems(itemModels, draggedModel) {
    itemModels.forEach((item, i)=>{
      item.set('weight', i);
    });
    this.set('currentModel.justDragged', draggedModel);
    this.set('currentModel.record.sorted', true);
  },

  actions: {
    reorderItems(itemModels, draggedModel) {
      this.reorderItems(itemModels, draggedModel);
    },
    saveLinksOrder() {
      const ENV = Ember.getOwner(this).resolveRegistration('config:environment');

      const menuId = this.get('currentModel.record.id'),
        data = {};

      const tableDrag = this.get('currentModel.tableDrag');
      if (!tableDrag) {
        return null;
      }

      const form = Ember.$(tableDrag.table).parent();
      const fields = form.serializeArray();

      for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        data[field.name] = field.value;
      }

      let headers = { Accept: 'application/vnd.api+json' },
          accessToken = this.get('session.session.authenticated.access_token');

      if (accessToken) {
        headers.Authorization = `Basic ${accessToken}`;
      }

      Ember.$.ajax({
        url: `${ENV.API_HOST}/admin/menu/${menuId}/sort-links`,
        type: 'POST',
        headers: headers,
        data: data
      })
      .done( ()=> {
        this.get('notifications').success('Ordem salva');
      })
      .fail( ()=> {
        this.get('notifications').error('Erro ao salvar a ordem dos links');
      });

    },

    onTabledragDropRow(ctx) {
      this.set('currentModel.tableDrag', ctx.tableDrag);
      this.set('currentModel.record.sorted', true);
    },

    deleteLink(link, links) {
      if (this.linkHaveChildrens(link, links)) {
        alert('Não é possível remover o link.\nRemova os sublinks antes de remover esse link.');
        return false;
      }

      if (confirm(`Tem certeza que deseja deletar o link "${link.get('text')}"? \nEssa ação não pode ser desfeita.`)) {

        link.destroyRecord()
        .then( ()=> {
          // remove from view:
          Ember.$('#tabledrad-item-'+link.id).remove();
          links.removeObject(link);

          this.get('notifications').success(`O link "${link.get('text')}" foi deletado.`);
          return null;
        });
      }
    }
  },


  linkHaveChildrens(link, links) {
    for (let i = 0; i < links.get('length'); i++) {
      let listItem = links.objectAt(i);
      let parent = listItem.get('parent');

      if (
        parent &&
        Number(parent) === Number(link.id)
      ) {
        return true;
      }

    }

    return false;
  }
});

// TODO move to an API
const icons = {
  "fa-500px": "500px",
  "fa-adjust": "Ajustar",
  "fa-adn": "Adn",
  "fa-align-center": "Align Center",
  "fa-align-justify": "Align Justify",
  "fa-align-left": "Align Left",
  "fa-align-right": "Align Right",
  "fa-amazon": "Amazon",
  "fa-ambulance": "Ambulance",
  "fa-anchor": "Anchor",
  "fa-android": "Android",
  "fa-angellist": "Angellist",
  "fa-angle-double-down": "Angle Double Down",
  "fa-angle-double-left": "Angle Double Left",
  "fa-angle-double-right": "Angle Double Right",
  "fa-angle-double-up": "Angle Double Up",
  "fa-angle-down": "Angle Down",
  "fa-angle-left": "Angle Left",
  "fa-angle-right": "Angle Right",
  "fa-angle-up": "Angle Up",
  "fa-apple": "Apple",
  "fa-archive": "Archive",
  "fa-area-chart": "Area Chart",
  "fa-arrow-circle-down": "Arrow Circle Down",
  "fa-arrow-circle-left": "Arrow Circle Left",
  "fa-arrow-circle-o-down": "Arrow Circle O Down",
  "fa-arrow-circle-o-left": "Arrow Circle O Left",
  "fa-arrow-circle-o-right": "Arrow Circle O Right",
  "fa-arrow-circle-o-up": "Arrow Circle O Up",
  "fa-arrow-circle-right": "Arrow Circle Right",
  "fa-arrow-circle-up": "Arrow Circle Up",
  "fa-arrow-down": "Arrow Down",
  "fa-arrow-left": "Arrow Left",
  "fa-arrow-right": "Arrow Right",
  "fa-arrow-up": "Arrow Up",
  "fa-arrows": "Arrows",
  "fa-arrows-alt": "Arrows Alt",
  "fa-arrows-h": "Arrows H",
  "fa-arrows-v": "Arrows V",
  "fa-asterisk": "Asterisk",
  "fa-at": "At",
  "fa-automobile": "Automobile",
  "fa-backward": "Backward",
  "fa-balance-scale": "Balance Scale",
  "fa-ban": "Ban",
  "fa-bank": "Bank",
  "fa-bar-chart": "Bar Chart",
  "fa-bar-chart-o": "Bar Chart O",
  "fa-barcode": "Barcode",
  "fa-bars": "Bars",
  "fa-battery-0": "Battery 0",
  "fa-battery-1": "Battery 1",
  "fa-battery-2": "Battery 2",
  "fa-battery-3": "Battery 3",
  "fa-battery-4": "Battery 4",
  "fa-battery-empty": "Battery Empty",
  "fa-battery-full": "Battery Full",
  "fa-battery-half": "Battery Half",
  "fa-battery-quarter": "Battery Quarter",
  "fa-battery-three-quarters": "Battery Three Quarters",
  "fa-bed": "Bed",
  "fa-beer": "Beer",
  "fa-behance": "Behance",
  "fa-behance-square": "Behance Square",
  "fa-bell": "Bell",
  "fa-bell-o": "Bell O",
  "fa-bell-slash": "Bell Slash",
  "fa-bell-slash-o": "Bell Slash O",
  "fa-bicycle": "Bicycle",
  "fa-binoculars": "Binoculars",
  "fa-birthday-cake": "Birthday Cake",
  "fa-bitbucket": "Bitbucket",
  "fa-bitbucket-square": "Bitbucket Square",
  "fa-bitcoin": "Bitcoin",
  "fa-black-tie": "Black Tie",
  "fa-bluetooth": "Bluetooth",
  "fa-bluetooth-b": "Bluetooth B",
  "fa-bold": "Bold",
  "fa-bolt": "Bolt",
  "fa-bomb": "Bomb",
  "fa-book": "Book",
  "fa-bookmark": "Bookmark",
  "fa-bookmark-o": "Bookmark O",
  "fa-briefcase": "Briefcase",
  "fa-btc": "Btc",
  "fa-bug": "Bug",
  "fa-building": "Building",
  "fa-building-o": "Building O",
  "fa-bullhorn": "Bullhorn",
  "fa-bullseye": "Bullseye",
  "fa-bus": "Bus",
  "fa-buysellads": "Buysellads",
  "fa-cab": "Cab",
  "fa-calculator": "Calculator",
  "fa-calendar": "Calendar",
  "fa-calendar-check-o": "Calendar Check O",
  "fa-calendar-minus-o": "Calendar Minus O",
  "fa-calendar-o": "Calendar O",
  "fa-calendar-plus-o": "Calendar Plus O",
  "fa-calendar-times-o": "Calendar Times O",
  "fa-camera": "Camera",
  "fa-camera-retro": "Camera Retro",
  "fa-car": "Car",
  "fa-caret-down": "Caret Down",
  "fa-caret-left": "Caret Left",
  "fa-caret-right": "Caret Right",
  "fa-caret-square-o-down": "Caret Square O Down",
  "fa-caret-square-o-left": "Caret Square O Left",
  "fa-caret-square-o-right": "Caret Square O Right",
  "fa-caret-square-o-up": "Caret Square O Up",
  "fa-caret-up": "Caret Up",
  "fa-cart-arrow-down": "Cart Arrow Down",
  "fa-cart-plus": "Cart Plus",
  "fa-cc": "Cc",
  "fa-cc-amex": "Cc Amex",
  "fa-cc-diners-club": "Cc Diners Club",
  "fa-cc-discover": "Cc Discover",
  "fa-cc-jcb": "Cc Jcb",
  "fa-cc-mastercard": "Cc Mastercard",
  "fa-cc-paypal": "Cc Paypal",
  "fa-cc-stripe": "Cc Stripe",
  "fa-cc-visa": "Cc Visa",
  "fa-certificate": "Certificate",
  "fa-chain": "Chain",
  "fa-chain-broken": "Chain Broken",
  "fa-check": "Check",
  "fa-check-circle": "Check Circle",
  "fa-check-circle-o": "Check Circle O",
  "fa-check-square": "Check Square",
  "fa-check-square-o": "Check Square O",
  "fa-chevron-circle-down": "Chevron Circle Down",
  "fa-chevron-circle-left": "Chevron Circle Left",
  "fa-chevron-circle-right": "Chevron Circle Right",
  "fa-chevron-circle-up": "Chevron Circle Up",
  "fa-chevron-down": "Chevron Down",
  "fa-chevron-left": "Chevron Left",
  "fa-chevron-right": "Chevron Right",
  "fa-chevron-up": "Chevron Up",
  "fa-child": "Child",
  "fa-chrome": "Chrome",
  "fa-circle": "Circle",
  "fa-circle-o": "Circle O",
  "fa-circle-o-notch": "Circle O Notch",
  "fa-circle-thin": "Circle Thin",
  "fa-clipboard": "Clipboard",
  "fa-clock-o": "Clock O",
  "fa-clone": "Clone",
  "fa-close": "Close",
  "fa-cloud": "Cloud",
  "fa-cloud-download": "Cloud Download",
  "fa-cloud-upload": "Cloud Upload",
  "fa-cny": "Cny",
  "fa-code": "Code",
  "fa-code-fork": "Code Fork",
  "fa-codepen": "Codepen",
  "fa-codiepie": "Codiepie",
  "fa-coffee": "Coffee",
  "fa-cog": "Cog",
  "fa-cogs": "Cogs",
  "fa-columns": "Columns",
  "fa-comment": "Comment",
  "fa-comment-o": "Comment O",
  "fa-commenting": "Commenting",
  "fa-commenting-o": "Commenting O",
  "fa-comments": "Comments",
  "fa-comments-o": "Comments O",
  "fa-compass": "Compass",
  "fa-compress": "Compress",
  "fa-connectdevelop": "Connectdevelop",
  "fa-contao": "Contao",
  "fa-copy": "Copy",
  "fa-copyright": "Copyright",
  "fa-creative-commons": "Creative Commons",
  "fa-credit-card": "Credit Card",
  "fa-credit-card-alt": "Credit Card Alt",
  "fa-crop": "Crop",
  "fa-crosshairs": "Crosshairs",
  "fa-css3": "Css3",
  "fa-cube": "Cube",
  "fa-cubes": "Cubes",
  "fa-cut": "Cut",
  "fa-cutlery": "Cutlery",
  "fa-dashboard": "Dashboard",
  "fa-dashcube": "Dashcube",
  "fa-database": "Database",
  "fa-dedent": "Dedent",
  "fa-delicious": "Delicious",
  "fa-desktop": "Desktop",
  "fa-deviantart": "Deviantart",
  "fa-diamond": "Diamond",
  "fa-digg": "Digg",
  "fa-dollar": "Dollar",
  "fa-dot-circle-o": "Dot Circle O",
  "fa-download": "Download",
  "fa-dribbble": "Dribbble",
  "fa-dropbox": "Dropbox",
  "fa-drupal": "Drupal",
  "fa-edge": "Edge",
  "fa-edit": "Edit",
  "fa-eject": "Eject",
  "fa-ellipsis-h": "Ellipsis H",
  "fa-ellipsis-v": "Ellipsis V",
  "fa-empire": "Empire",
  "fa-envelope": "Envelope",
  "fa-envelope-o": "Envelope O",
  "fa-envelope-square": "Envelope Square",
  "fa-eraser": "Eraser",
  "fa-eur": "Eur",
  "fa-euro": "Euro",
  "fa-exchange": "Exchange",
  "fa-exclamation": "Exclamation",
  "fa-exclamation-circle": "Exclamation Circle",
  "fa-exclamation-triangle": "Exclamation Triangle",
  "fa-expand": "Expand",
  "fa-expeditedssl": "Expeditedssl",
  "fa-external-link": "External Link",
  "fa-external-link-square": "External Link Square",
  "fa-eye": "Eye",
  "fa-eye-slash": "Eye Slash",
  "fa-eyedropper": "Eyedropper",
  "fa-facebook": "Facebook",
  "fa-facebook-f": "Facebook F",
  "fa-facebook-official": "Facebook Official",
  "fa-facebook-square": "Facebook Square",
  "fa-fast-backward": "Fast Backward",
  "fa-fast-forward": "Fast Forward",
  "fa-fax": "Fax",
  "fa-feed": "Feed",
  "fa-female": "Female",
  "fa-fighter-jet": "Fighter Jet",
  "fa-file": "File",
  "fa-file-archive-o": "File Archive O",
  "fa-file-audio-o": "File Audio O",
  "fa-file-code-o": "File Code O",
  "fa-file-excel-o": "File Excel O",
  "fa-file-image-o": "File Image O",
  "fa-file-movie-o": "File Movie O",
  "fa-file-o": "File O",
  "fa-file-pdf-o": "File Pdf O",
  "fa-file-photo-o": "File Photo O",
  "fa-file-picture-o": "File Picture O",
  "fa-file-powerpoint-o": "File Powerpoint O",
  "fa-file-sound-o": "File Sound O",
  "fa-file-text": "File Text",
  "fa-file-text-o": "File Text O",
  "fa-file-video-o": "File Video O",
  "fa-file-word-o": "File Word O",
  "fa-file-zip-o": "File Zip O",
  "fa-files-o": "Files O",
  "fa-film": "Film",
  "fa-filter": "Filter",
  "fa-fire": "Fire",
  "fa-fire-extinguisher": "Fire Extinguisher",
  "fa-firefox": "Firefox",
  "fa-flag": "Flag",
  "fa-flag-checkered": "Flag Checkered",
  "fa-flag-o": "Flag O",
  "fa-flash": "Flash",
  "fa-flask": "Flask",
  "fa-flickr": "Flickr",
  "fa-floppy-o": "Floppy O",
  "fa-folder": "Folder",
  "fa-folder-o": "Folder O",
  "fa-folder-open": "Folder Open",
  "fa-folder-open-o": "Folder Open O",
  "fa-font": "Font",
  "fa-fonticons": "Fonticons",
  "fa-fort-awesome": "Fort Awesome",
  "fa-forumbee": "Forumbee",
  "fa-forward": "Forward",
  "fa-foursquare": "Foursquare",
  "fa-frown-o": "Frown O",
  "fa-futbol-o": "Futbol O",
  "fa-gamepad": "Gamepad",
  "fa-gavel": "Gavel",
  "fa-gbp": "Gbp",
  "fa-ge": "Ge",
  "fa-gear": "Gear",
  "fa-gears": "Gears",
  "fa-genderless": "Genderless",
  "fa-get-pocket": "Get Pocket",
  "fa-gg": "Gg",
  "fa-gg-circle": "Gg Circle",
  "fa-gift": "Gift",
  "fa-git": "Git",
  "fa-git-square": "Git Square",
  "fa-github": "Github",
  "fa-github-alt": "Github Alt",
  "fa-github-square": "Github Square",
  "fa-gittip": "Gittip",
  "fa-glass": "Glass",
  "fa-globe": "Globe",
  "fa-google": "Google",
  "fa-google-plus": "Google Plus",
  "fa-google-plus-square": "Google Plus Square",
  "fa-google-wallet": "Google Wallet",
  "fa-graduation-cap": "Graduation Cap",
  "fa-gratipay": "Gratipay",
  "fa-group": "Group",
  "fa-h-square": "H Square",
  "fa-hacker-news": "Hacker News",
  "fa-hand-grab-o": "Hand Grab O",
  "fa-hand-lizard-o": "Hand Lizard O",
  "fa-hand-o-down": "Hand O Down",
  "fa-hand-o-left": "Hand O Left",
  "fa-hand-o-right": "Hand O Right",
  "fa-hand-o-up": "Hand O Up",
  "fa-hand-paper-o": "Hand Paper O",
  "fa-hand-peace-o": "Hand Peace O",
  "fa-hand-pointer-o": "Hand Pointer O",
  "fa-hand-rock-o": "Hand Rock O",
  "fa-hand-scissors-o": "Hand Scissors O",
  "fa-hand-spock-o": "Hand Spock O",
  "fa-hand-stop-o": "Hand Stop O",
  "fa-hashtag": "Hashtag",
  "fa-hdd-o": "Hdd O",
  "fa-header": "Header",
  "fa-headphones": "Headphones",
  "fa-heart": "Heart",
  "fa-heart-o": "Heart O",
  "fa-heartbeat": "Heartbeat",
  "fa-history": "History",
  "fa-home": "Home",
  "fa-hospital-o": "Hospital O",
  "fa-hotel": "Hotel",
  "fa-hourglass": "Hourglass",
  "fa-hourglass-1": "Hourglass 1",
  "fa-hourglass-2": "Hourglass 2",
  "fa-hourglass-3": "Hourglass 3",
  "fa-hourglass-end": "Hourglass End",
  "fa-hourglass-half": "Hourglass Half",
  "fa-hourglass-o": "Hourglass O",
  "fa-hourglass-start": "Hourglass Start",
  "fa-houzz": "Houzz",
  "fa-html5": "Html5",
  "fa-i-cursor": "I Cursor",
  "fa-ils": "Ils",
  "fa-image": "Image",
  "fa-inbox": "Inbox",
  "fa-indent": "Indent",
  "fa-industry": "Industry",
  "fa-info": "Info",
  "fa-info-circle": "Info Circle",
  "fa-inr": "Inr",
  "fa-instagram": "Instagram",
  "fa-institution": "Institution",
  "fa-internet-explorer": "Internet Explorer",
  "fa-intersex": "Intersex",
  "fa-ioxhost": "Ioxhost",
  "fa-italic": "Italic",
  "fa-joomla": "Joomla",
  "fa-jpy": "Jpy",
  "fa-jsfiddle": "Jsfiddle",
  "fa-key": "Key",
  "fa-keyboard-o": "Keyboard O",
  "fa-krw": "Krw",
  "fa-language": "Language",
  "fa-laptop": "Laptop",
  "fa-lastfm": "Lastfm",
  "fa-lastfm-square": "Lastfm Square",
  "fa-leaf": "Leaf",
  "fa-leanpub": "Leanpub",
  "fa-legal": "Legal",
  "fa-lemon-o": "Lemon O",
  "fa-level-down": "Level Down",
  "fa-level-up": "Level Up",
  "fa-life-bouy": "Life Bouy",
  "fa-life-buoy": "Life Buoy",
  "fa-life-ring": "Life Ring",
  "fa-life-saver": "Life Saver",
  "fa-lightbulb-o": "Lightbulb O",
  "fa-line-chart": "Line Chart",
  "fa-link": "Link",
  "fa-linkedin": "Linkedin",
  "fa-linkedin-square": "Linkedin Square",
  "fa-linux": "Linux",
  "fa-list": "List",
  "fa-list-alt": "List Alt",
  "fa-list-ol": "List Ol",
  "fa-list-ul": "List Ul",
  "fa-location-arrow": "Location Arrow",
  "fa-lock": "Lock",
  "fa-long-arrow-down": "Long Arrow Down",
  "fa-long-arrow-left": "Long Arrow Left",
  "fa-long-arrow-right": "Long Arrow Right",
  "fa-long-arrow-up": "Long Arrow Up",
  "fa-magic": "Magic",
  "fa-magnet": "Magnet",
  "fa-mail-forward": "Mail Forward",
  "fa-mail-reply": "Mail Reply",
  "fa-mail-reply-all": "Mail Reply All",
  "fa-male": "Male",
  "fa-map": "Map",
  "fa-map-marker": "Map Marker",
  "fa-map-o": "Map O",
  "fa-map-pin": "Map Pin",
  "fa-map-signs": "Map Signs",
  "fa-mars": "Mars",
  "fa-mars-double": "Mars Double",
  "fa-mars-stroke": "Mars Stroke",
  "fa-mars-stroke-h": "Mars Stroke H",
  "fa-mars-stroke-v": "Mars Stroke V",
  "fa-maxcdn": "Maxcdn",
  "fa-meanpath": "Meanpath",
  "fa-medium": "Medium",
  "fa-medkit": "Medkit",
  "fa-meh-o": "Meh O",
  "fa-mercury": "Mercury",
  "fa-microphone": "Microphone",
  "fa-microphone-slash": "Microphone Slash",
  "fa-minus": "Minus",
  "fa-minus-circle": "Minus Circle",
  "fa-minus-square": "Minus Square",
  "fa-minus-square-o": "Minus Square O",
  "fa-mixcloud": "Mixcloud",
  "fa-mobile": "Mobile",
  "fa-mobile-phone": "Mobile Phone",
  "fa-modx": "Modx",
  "fa-money": "Money",
  "fa-moon-o": "Moon O",
  "fa-mortar-board": "Mortar Board",
  "fa-motorcycle": "Motorcycle",
  "fa-mouse-pointer": "Mouse Pointer",
  "fa-music": "Music",
  "fa-navicon": "Navicon",
  "fa-neuter": "Neuter",
  "fa-newspaper-o": "Newspaper O",
  "fa-object-group": "Object Group",
  "fa-object-ungroup": "Object Ungroup",
  "fa-odnoklassniki": "Odnoklassniki",
  "fa-odnoklassniki-square": "Odnoklassniki Square",
  "fa-opencart": "Opencart",
  "fa-openid": "Openid",
  "fa-opera": "Opera",
  "fa-optin-monster": "Optin Monster",
  "fa-outdent": "Outdent",
  "fa-pagelines": "Pagelines",
  "fa-paint-brush": "Paint Brush",
  "fa-paper-plane": "Paper Plane",
  "fa-paper-plane-o": "Paper Plane O",
  "fa-paperclip": "Paperclip",
  "fa-paragraph": "Paragraph",
  "fa-paste": "Paste",
  "fa-pause": "Pause",
  "fa-pause-circle": "Pause Circle",
  "fa-pause-circle-o": "Pause Circle O",
  "fa-paw": "Paw",
  "fa-paypal": "Paypal",
  "fa-pencil": "Pencil",
  "fa-pencil-square": "Pencil Square",
  "fa-pencil-square-o": "Pencil Square O",
  "fa-percent": "Percent",
  "fa-phone": "Phone",
  "fa-phone-square": "Phone Square",
  "fa-photo": "Photo",
  "fa-picture-o": "Picture O",
  "fa-pie-chart": "Pie Chart",
  "fa-pied-piper": "Pied Piper",
  "fa-pied-piper-alt": "Pied Piper Alt",
  "fa-pinterest": "Pinterest",
  "fa-pinterest-p": "Pinterest P",
  "fa-pinterest-square": "Pinterest Square",
  "fa-plane": "Plane",
  "fa-play": "Play",
  "fa-play-circle": "Play Circle",
  "fa-play-circle-o": "Play Circle O",
  "fa-plug": "Plug",
  "fa-plus": "Plus",
  "fa-plus-circle": "Plus Circle",
  "fa-plus-square": "Plus Square",
  "fa-plus-square-o": "Plus Square O",
  "fa-power-off": "Power Off",
  "fa-print": "Print",
  "fa-product-hunt": "Product Hunt",
  "fa-puzzle-piece": "Puzzle Piece",
  "fa-qq": "Qq",
  "fa-qrcode": "Qrcode",
  "fa-question": "Question",
  "fa-question-circle": "Question Circle",
  "fa-quote-left": "Quote Left",
  "fa-quote-right": "Quote Right",
  "fa-ra": "Ra",
  "fa-random": "Random",
  "fa-rebel": "Rebel",
  "fa-recycle": "Recycle",
  "fa-reddit": "Reddit",
  "fa-reddit-alien": "Reddit Alien",
  "fa-reddit-square": "Reddit Square",
  "fa-refresh": "Refresh",
  "fa-registered": "Registered",
  "fa-remove": "Remove",
  "fa-renren": "Renren",
  "fa-reorder": "Reorder",
  "fa-repeat": "Repeat",
  "fa-reply": "Reply",
  "fa-reply-all": "Reply All",
  "fa-retweet": "Retweet",
  "fa-rmb": "Rmb",
  "fa-road": "Road",
  "fa-rocket": "Rocket",
  "fa-rotate-left": "Rotate Left",
  "fa-rotate-right": "Rotate Right",
  "fa-rouble": "Rouble",
  "fa-rss": "Rss",
  "fa-rss-square": "Rss Square",
  "fa-rub": "Rub",
  "fa-ruble": "Ruble",
  "fa-rupee": "Rupee",
  "fa-safari": "Safari",
  "fa-save": "Save",
  "fa-scissors": "Scissors",
  "fa-scribd": "Scribd",
  "fa-search": "Search",
  "fa-search-minus": "Search Minus",
  "fa-search-plus": "Search Plus",
  "fa-sellsy": "Sellsy",
  "fa-send": "Send",
  "fa-send-o": "Send O",
  "fa-server": "Server",
  "fa-share": "Share",
  "fa-share-alt": "Share Alt",
  "fa-share-alt-square": "Share Alt Square",
  "fa-share-square": "Share Square",
  "fa-share-square-o": "Share Square O",
  "fa-shekel": "Shekel",
  "fa-sheqel": "Sheqel",
  "fa-shield": "Shield",
  "fa-ship": "Ship",
  "fa-shirtsinbulk": "Shirtsinbulk",
  "fa-shopping-bag": "Shopping Bag",
  "fa-shopping-basket": "Shopping Basket",
  "fa-shopping-cart": "Shopping Cart",
  "fa-sign-in": "Sign In",
  "fa-sign-out": "Sign Out",
  "fa-signal": "Signal",
  "fa-simplybuilt": "Simplybuilt",
  "fa-sitemap": "Sitemap",
  "fa-skyatlas": "Skyatlas",
  "fa-skype": "Skype",
  "fa-slack": "Slack",
  "fa-sliders": "Sliders",
  "fa-slideshare": "Slideshare",
  "fa-smile-o": "Smile O",
  "fa-soccer-ball-o": "Soccer Ball O",
  "fa-sort": "Sort",
  "fa-sort-alpha-asc": "Sort Alpha Asc",
  "fa-sort-alpha-desc": "Sort Alpha Desc",
  "fa-sort-amount-asc": "Sort Amount Asc",
  "fa-sort-amount-desc": "Sort Amount Desc",
  "fa-sort-asc": "Sort Asc",
  "fa-sort-desc": "Sort Desc",
  "fa-sort-down": "Sort Down",
  "fa-sort-numeric-asc": "Sort Numeric Asc",
  "fa-sort-numeric-desc": "Sort Numeric Desc",
  "fa-sort-up": "Sort Up",
  "fa-soundcloud": "Soundcloud",
  "fa-space-shuttle": "Space Shuttle",
  "fa-spinner": "Spinner",
  "fa-spoon": "Spoon",
  "fa-spotify": "Spotify",
  "fa-square": "Square",
  "fa-square-o": "Square O",
  "fa-stack-exchange": "Stack Exchange",
  "fa-stack-overflow": "Stack Overflow",
  "fa-star": "Star",
  "fa-star-half": "Star Half",
  "fa-star-half-empty": "Star Half Empty",
  "fa-star-half-full": "Star Half Full",
  "fa-star-half-o": "Star Half O",
  "fa-star-o": "Star O",
  "fa-steam": "Steam",
  "fa-steam-square": "Steam Square",
  "fa-step-backward": "Step Backward",
  "fa-step-forward": "Step Forward",
  "fa-stethoscope": "Stethoscope",
  "fa-sticky-note": "Sticky Note",
  "fa-sticky-note-o": "Sticky Note O",
  "fa-stop": "Stop",
  "fa-stop-circle": "Stop Circle",
  "fa-stop-circle-o": "Stop Circle O",
  "fa-street-view": "Street View",
  "fa-strikethrough": "Strikethrough",
  "fa-stumbleupon": "Stumbleupon",
  "fa-stumbleupon-circle": "Stumbleupon Circle",
  "fa-subscript": "Subscript",
  "fa-subway": "Subway",
  "fa-suitcase": "Suitcase",
  "fa-sun-o": "Sun O",
  "fa-superscript": "Superscript",
  "fa-support": "Support",
  "fa-table": "Table",
  "fa-tablet": "Tablet",
  "fa-tachometer": "Tachometer",
  "fa-tag": "Tag",
  "fa-tags": "Tags",
  "fa-tasks": "Tasks",
  "fa-taxi": "Taxi",
  "fa-television": "Television",
  "fa-tencent-weibo": "Tencent Weibo",
  "fa-terminal": "Terminal",
  "fa-text-height": "Text Height",
  "fa-text-width": "Text Width",
  "fa-th": "Th",
  "fa-th-large": "Th Large",
  "fa-th-list": "Th List",
  "fa-thumb-tack": "Thumb Tack",
  "fa-thumbs-down": "Thumbs Down",
  "fa-thumbs-o-down": "Thumbs O Down",
  "fa-thumbs-o-up": "Thumbs O Up",
  "fa-thumbs-up": "Thumbs Up",
  "fa-ticket": "Ticket",
  "fa-times": "Times",
  "fa-times-circle": "Times Circle",
  "fa-times-circle-o": "Times Circle O",
  "fa-tint": "Tint",
  "fa-toggle-down": "Toggle Down",
  "fa-toggle-left": "Toggle Left",
  "fa-toggle-off": "Toggle Off",
  "fa-toggle-on": "Toggle On",
  "fa-toggle-right": "Toggle Right",
  "fa-toggle-up": "Toggle Up",
  "fa-trademark": "Trademark",
  "fa-train": "Train",
  "fa-transgender": "Transgender",
  "fa-transgender-alt": "Transgender Alt",
  "fa-trash": "Trash",
  "fa-trash-o": "Trash O",
  "fa-tree": "Tree",
  "fa-trello": "Trello",
  "fa-tripadvisor": "Tripadvisor",
  "fa-trophy": "Trophy",
  "fa-truck": "Truck",
  "fa-try": "Try",
  "fa-tty": "Tty",
  "fa-tumblr": "Tumblr",
  "fa-tumblr-square": "Tumblr Square",
  "fa-turkish-lira": "Turkish Lira",
  "fa-tv": "Tv",
  "fa-twitch": "Twitch",
  "fa-twitter": "Twitter",
  "fa-twitter-square": "Twitter Square",
  "fa-umbrella": "Umbrella",
  "fa-underline": "Underline",
  "fa-undo": "Undo",
  "fa-university": "University",
  "fa-unlink": "Unlink",
  "fa-unlock": "Unlock",
  "fa-unlock-alt": "Unlock Alt",
  "fa-unsorted": "Unsorted",
  "fa-upload": "Upload",
  "fa-usb": "Usb",
  "fa-usd": "Usd",
  "fa-user": "User",
  "fa-user-md": "User Md",
  "fa-user-plus": "User Plus",
  "fa-user-secret": "User Secret",
  "fa-user-times": "User Times",
  "fa-users": "Users",
  "fa-venus": "Venus",
  "fa-venus-double": "Venus Double",
  "fa-venus-mars": "Venus Mars",
  "fa-viacoin": "Viacoin",
  "fa-video-camera": "Video Camera",
  "fa-vimeo": "Vimeo",
  "fa-vimeo-square": "Vimeo Square",
  "fa-vine": "Vine",
  "fa-vk": "Vk",
  "fa-volume-down": "Volume Down",
  "fa-volume-off": "Volume Off",
  "fa-volume-up": "Volume Up",
  "fa-warning": "Warning",
  "fa-wechat": "Wechat",
  "fa-weibo": "Weibo",
  "fa-weixin": "Weixin",
  "fa-whatsapp": "Whatsapp",
  "fa-wheelchair": "Wheelchair",
  "fa-wifi": "Wifi",
  "fa-wikipedia-w": "Wikipedia W",
  "fa-windows": "Windows",
  "fa-won": "Won",
  "fa-wordpress": "Wordpress",
  "fa-wrench": "Wrench",
  "fa-xing": "Xing",
  "fa-xing-square": "Xing Square",
  "fa-y-combinator": "Y Combinator",
  "fa-y-combinator-square": "Y Combinator Square",
  "fa-yahoo": "Yahoo",
  "fa-yc": "Yc",
  "fa-yc-square": "Yc Square",
  "fa-yelp": "Yelp",
  "fa-yen": "Yen",
  "fa-youtube": "Youtube",
  "fa-youtube-play": "Youtube Play",
  "fa-youtube-square": "Youtube Square"
};
