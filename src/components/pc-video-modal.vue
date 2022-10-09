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
          <div v-for="(item, index) in videos" :key="item.id" :class="{ active: curPlayVideo && curPlayVideo.id == item.id }" @click="playVideo(index)" v-show="!showOneVideo || (showOneVideo && item.id == curPlayVideo.id)">
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
    showOneVideo: {
      type: Boolean,
      default: false,
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
      this.$emit('close-play');
    },
  },
};
</script>

<style lang="scss" scoped>
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
  .content {
    width: 1140px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #2d2d2d;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      line-height: 24px;
      img {
        width: 20px;
        cursor: pointer;
      }
    }

    .video-container {
      display: flex;
      height: 450px;
      .players {
        width: 800px;
        height: 450px;
      }
      .video-list {
        background: #2d2d2d;
        border-top: 1px solid #3c3c3c;
        > div {
          height: 50px;
          width: 340px;
          border-bottom: 1px solid #3c3c3c;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          font-size: 14px;
          color: #969696;
          cursor: pointer;
          line-height: 19px;
          img {
            width: 18px;
          }
          &.active {
            background: #1e1e1e;
            color: #ffcfa3;
          }
          &:hover {
            color: #ffcfa3;
          }
        }
      }
    }
  }
}
</style>
