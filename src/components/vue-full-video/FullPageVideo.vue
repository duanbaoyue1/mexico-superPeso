<template>
  <section class="wrap" ref="wrap">
    <video
      class="video"
      :ref="'video'"
      preload="auto"
      :src="videoSrc"
      controls
      @playing="onPlaying"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
      @canplay="onCanplay"
    >
      您的浏览器不支持 video 标签。
    </video>
    <div @click="play"></div>
    <div v-show="videoCloseBtn" class="btn-close-wrap">
      <div @click="close" class="btn-back">
        <svg
          t="1595578880034"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1125"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="200"
          height="200"
        >
          <path
            d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z"
            fill="#ffffff"
            p-id="1126"
          ></path>
        </svg>
        <span>返回</span>
      </div>

      <svg
        class="btn-close"
        @click="close"
        t="1569396633085"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1195"
        width="200"
        height="200"
      >
        <path
          d="M578.382 512.5L861.58 795.696c18.745 18.745 18.745 49.137 0 67.883-18.746 18.745-49.138 18.745-67.883 0L510.5 580.382 227.304 863.58c-18.745 18.745-49.137 18.745-67.883 0-18.745-18.746-18.745-49.138 0-67.883L442.618 512.5 159.42 229.304c-18.745-18.745-18.745-49.137 0-67.883 18.746-18.745 49.138-18.745 67.883 0L510.5 444.618 793.696 161.42c18.745-18.745 49.137-18.745 67.883 0 18.745 18.746 18.745 49.138 0 67.883L578.382 512.5z"
          p-id="1196"
          fill="#ffffff"
        />
      </svg>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    videoSrc: {
      require: true
    }
  },
  data() {
    return {
      videoCloseBtn: true,
      isCanplay: false,
      autoPlay: false
    };
  },
  watch: {
    videoSrc() {
      this.isCanplay = false;
    }
  },
  computed: {
    video() {
      return this.$refs['video'];
    },
    wrap() {
      return this.$refs['wrap'];
    }
  },
  methods: {
    play() {
      this.$mount();
      if (this.video.paused && this.isCanplay) {
        this.video.play();
      } else {
        this.video.play();
        // this.autoPlay = true;
      }
    },
    pause() {
      if (this.video.paused) return;
      this.video.pause();
    },
    show() {
      this.$emit('show');
      document.body.appendChild(this.$el);
    },
    hide() {
      this.$emit('hide');
      this.$destroy();
      document.body.removeChild(this.$el);
    },
    close() {
      this.$emit('close');
      this.pause();
    },

    onCanplay() {
      this.isCanplay = true;
      if (this.autoPlay) {
        this.play();
        this.autoPlay = false;
      }
    },

    onPlaying() {
      this.$emit('playing');
      this.show();
    },
    onPause() {
      this.$emit('pause');
    },
    onEnded() {
      this.$emit('ended');
    },
    onError(e) {
      if (this.videoSrc === '') return;
      console.error('视频报错:', e);
      this.$emit('error');
    },
    getVideo() {
      return this.video;
    },
    setVideoSrc(videoSrc) {
      this.videoSrc = videoSrc;
    }
  }
};
</script>
<style lang="scss" scoped>
$menu-height: 30px;
.wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  z-index: 1;
  .video {
    width: 100%;
    height: calc(100% - #{$menu-height});
    position: absolute;
    top: $menu-height;
    left: 0px;
    background-color: #000;
    object-fit: contain;
    object-position: center;
  }
  .btn-close-wrap {
    width: 100%;
    height: $menu-height;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: black;
    .btn-close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 5px;
      right: 10px;
      transform: translateZ(200px);
      background-color: rgba(0, 0, 0, 0.445);
    }
    .btn-back {
      // width: 200px;
      height: 25px;
      position: absolute;
      top: 5px;
      left: 10px;
      transform: translateZ(200px);
      background-color: rgba(0, 0, 0, 0.445);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      svg {
        width: 30px;
        height: 25px;
      }
      span {
        font-size: vw(30);
      }
    }
  }
}
</style>
