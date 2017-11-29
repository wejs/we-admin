import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mt-actions-sitecontact-form', 'Integration | Component | mt actions sitecontact form', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mt-actions-sitecontact-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mt-actions-sitecontact-form}}
      template block text
    {{/mt-actions-sitecontact-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
