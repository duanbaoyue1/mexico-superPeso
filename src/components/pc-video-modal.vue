<template>
  <div class="video-modal" v-if="curPlayVideo">
    <div class="content">
      <div class="header">
        <span>视频预览</span>
        <img @click="closeVideoPlay" :src="require('@/assets/img/web/close.png')" />
      </div>
      <div class="video-container">
        <vue-core-video-player :cover="curPlayVideo.imageUrl" :src="curPlayVideo.videoUrl"></vue-core-video-player>
        <div class="video-list">
          <div v-for="(item, index) in videos" :key="item.id" :class="{ active: curPlayVideo && curPlayVideo.id == item.id }" @click="playVideo(index)">
            <span>{{ item.title }}</span>
            <img v-if="curPlayVideo && curPlayVideo.id == item.id" :src="require('@/assets/img/web/cur-play@2x.png')" />
            <img v-else :src="require('@/assets/img/web/play@2x.png')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueCoreVideoPlayer from 'vue-core-video-player';
Vue.use(VueCoreVideoPlayer, {
  lang: 'zh-CN',
});

export default {
  props: {
    videos: {
      type: Array,
    },
    initVideoIndex: {
      type: Number,
    },
  },

  watch: {
    initVideoIndex(newIndex, oldIndex) {
      if (newIndex != -1) {
        this.playVideo(newIndex);
      }
    },
  },

  data() {
    return {
      curPlayVideo: null,
    };
  },

  methods: {
    playVideo(index) {
      this.curPlayVideo = this.videos[index];
      document.body.style.overflow = 'hidden';
    },

    closeVideoPlay() {
      this.initVideoIndex = -1;
      this.curPlayVideo = null;
      document.body.style.overflow = '';
      this.$emit('close-play')
    },
  },
};
</script>
