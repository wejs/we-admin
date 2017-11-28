import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-links-sort-menu', 'Integration | Component | menu links sort menu', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{menu-links-sort-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#menu-links-sort-menu}}
      template block text
    {{/menu-links-sort-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
