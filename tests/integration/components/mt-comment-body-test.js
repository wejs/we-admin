import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mt-comment-body', 'Integration | Component | mt comment body', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mt-comment-body}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mt-comment-body}}
      template block text
    {{/mt-comment-body}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
