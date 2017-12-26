import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('theme-color-item', 'Integration | Component | theme color item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{theme-color-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#theme-color-item}}
      template block text
    {{/theme-color-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
