import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  publishStatus: computed('record.{publishedAt,published}', function() {
    let publishedAt = this.get('record.publishedAt');
    let published = this.get('record.published');

    if (published) {
      return 'published';
    }

    if (publishedAt) {
      let unixNow = moment().unix();

      let p = moment(publishedAt);
      if (p.isValid()) {
        let pUnix = p.unix();

        if (pUnix >= unixNow) {
          return 'scheduled-future';
        } else {
          return 'scheduled-old';
        }
      }
    }

    return 'unpublished';
  })
});