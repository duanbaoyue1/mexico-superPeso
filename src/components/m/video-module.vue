<template>
  <div class="video-module">
    <div class="video" v-for="(item, index) in videos.slice(0, 2)" :key="item.id" @click="playVideo(item.videoUrl)">
      <img class="poster" :src="item.imageUrl" />
      <img class="play" :src="require('@/assets/img/play@2x.png')" />
      <div class="title">{{ item.title }}</div>
    </div>
    <div class="show-all" v-if="videos.length > 2" @click="showMore">
      <span>更多案例</span>
      <img :src="require('@/assets/img/arrow@2x.png')" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videos: {
      type: Array,
    },
  },
  data() {
    return {
      total: 2,
      index: 0,
    };
  },
  methods: {
    showMore() {
      let routeInfo = this.$router.resolve({ name: 'Videos', query: { type: this.$route.query.type } });
      window.open(routeInfo.href, '_blank');
      location.href = routeInfo.href;

      // this.$router.push({
      //   name: 'Videos',
      //   query: {
      //     type: this.$route.query.type,
      //   },
      // });
    },
  },
  mounted() {
    console.log(this.videos);
  },
};
</script>

<style lang="scss" scoped>
.video-module {
  display: flex;
  .show-all {
    width: 21px;
    height: 90px;
    background: #ffffff;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 400;
    color: #000000;
    line-height: 13px;
    padding: 12px 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    img {
      width: 9px;
      margin-top: 5px;
    }
  }
  .video {
    width: 160px;
    height: 90px;
    position: relative;
    border-radius: 5px;
    margin-right: 5px;
    .poster {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
    }
    .title {
      font-size: 11px;
      color: #ffffff;
      line-height: 16px;
      position: absolute;
      bottom: 0;
      padding: 5px 0;
      left: 0;
      right: 0;
      text-align: center;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
      border-radius: 0 0 5px 5px;
    }
  }
}
</style>
