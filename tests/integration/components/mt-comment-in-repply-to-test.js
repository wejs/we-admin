import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mt-comment-in-repply-to', 'Integration | Component | mt comment in repply to', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mt-comment-in-repply-to}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mt-comment-in-repply-to}}
      template block text
    {{/mt-comment-in-repply-to}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
