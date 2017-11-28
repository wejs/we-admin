import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('menu-links-sort-item', 'Integration | Component | menu links sort item', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{menu-links-sort-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#menu-links-sort-item}}
      template block text
    {{/menu-links-sort-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
