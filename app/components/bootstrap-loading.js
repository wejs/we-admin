import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  didInsertElement() {
    const lw = $('.loading-wrapper');
    lw.width( $( window ).width() );
    lw.height( $( window ).height() );
  }
});
