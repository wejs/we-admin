import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    dragEnd({ sourceList, sourceIndex, targetList, targetIndex }) {
      if (sourceList === targetList && sourceIndex === targetIndex) {
        return;
      }

      const item = sourceList.objectAt(sourceIndex);

      sourceList.removeAt(sourceIndex);
      targetList.insertAt(targetIndex, item);

      this.resetLinksWeight(this.get('model.links.links'), {
        cw: 0,
        depth: 0
      }, null);

      Ember.set(this, 'model.record.sorted', true);
    }
  },

  resetLinksWeight(links, ctx, parent) {
    for (let i = 0; i < links.get('length'); i++) {
      if (!parent) {
        // reset depth for each root item
        ctx.depth = 0;
      }
      this.resetLinkWeight(links[i], ctx, parent);
    }
  },

  resetLinkWeight(link, ctx, parent) {
    ctx.cw++;
    link.set('weight', ctx.cw);
    link.set('parent', parent);
    link.set('depth', ctx.depth);

    const subLinks = link.get('links');
    if (subLinks && Ember.get(subLinks, 'length')) {
      ctx.depth++;
      // this menu link have sublinks:
      this.resetLinksWeight(subLinks, ctx, link.id);
    }
  },
});