import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mt-actions-email-templates', 'Integration | Component | mt actions email templates', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mt-actions-email-templates}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mt-actions-email-templates}}
      template block text
    {{/mt-actions-email-templates}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
