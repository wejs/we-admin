import Ember from 'ember';

export default Ember.Component.extend({
  image: Ember.inject.service('image'),
  images: Ember.A(),
  onSelectImage: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.getLastUserImages();
  },

  getLastUserImages() {
    this.get('image').getLastUserImages()
    .then( (images)=> {
      if (images && images.length) {
        this.set('images', images);
      }
    });
  },

  actions: {
    onSelectImage(image) {
      let onSelectImage = this.get('onSelectImage');
      if (onSelectImage) {
        onSelectImage(image);
      }
    }
  }
});
