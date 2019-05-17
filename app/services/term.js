import Service from '@ember/service';
import { inject } from '@ember/service';
import { getOwner } from '@ember/application';
import $ from 'jquery';

let ENV;

export default Service.extend({
  session: inject(),
  ajax: inject(),

  init(){
    this._super(...arguments);

    ENV = getOwner(this).resolveRegistration('config:environment');
  },

  query(vocabularyId, opts) {
    let headers = { Accept: 'application/json' },
        accessToken = this.get('session.session.authenticated.access_token');

    if (accessToken) {
      headers.Authorization = `Basic ${accessToken}`;
    }

    return $.ajax({
      url: `${ENV.API_HOST}/vocabulary/${vocabularyId}/term`,
      type: 'GET',
      headers: headers,
      data: opts
    });
  },

  getSystemCategories() {
    let url = `${ENV.API_HOST}/api/v1/term-texts?vocabularyName=Category`;
    return this.get('ajax')
    .request(url)
    .then((json) => json.term );
  }
});