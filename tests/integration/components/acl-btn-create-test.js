import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('acl-btn-create', 'Integration | Component | acl btn create', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{acl-btn-create}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#acl-btn-create}}
      template block text
    {{/acl-btn-create}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
