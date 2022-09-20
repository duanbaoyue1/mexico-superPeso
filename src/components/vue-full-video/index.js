import FullPageVideo from './FullPageVideo.vue';
import Vue from 'vue';
let Constructor = Vue.extend(FullPageVideo);
let vm;

let fullPageVideo = {
  play: function(videoSrc) {
    vm = new Constructor({});
    vm.$props.videoSrc = videoSrc;
    vm.play();
    return vm;
  },
  hide: function() {
    vm.hide();
  },
  pause: function() {
    vm.pause();
  }
};

export default Vue => {
  Vue.prototype.$fullPageVideo = fullPageVideo;
};
