<template>
  <div class="container">
    <div class="video-wrapper" v-for="(item, index) in videos" :key="item.id" @click="playVideo(item.videoUrl)">
      <div class="video">
        <img class="poster" :src="item.imageUrl" />
        <img class="play" :src="require('@/assets/img/play@2x.png')" />
      </div>
      <div class="info">
        <div class="title">{{ item.title }}</div>
        <div class="sub-title" v-if="item.subTitle">{{ item.subTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Videos',
  components: {},
  data() {
    return {
      type: this.$route.query.type,
      videos: []
    };
  },
  mounted() {
    this.getVideoLists();
  },
  methods: {
    getVideoLists() {
      this.$http.get(`/core/api/videos/?strategyType=${this.type}&page_size=1000`).then(res => {
        this.videos = res.data.items;
      });
    }
  }
};
</script>
<style lang="scss">
.container {
  background: #fff !important;
}
img {
  display: block;
}
.video-wrapper {
  margin-left: 12px;
  margin-right: 12px;
  padding-top: 13px;
  padding-bottom: 9px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  align-items: center;
  .info {
    flex-grow: 1;
    .title {
      font-size: 15px;
      font-weight: 400;
      color: #000000;
      line-height: 21px;
    }
    .sub-title {
      margin-top: 10px;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
    }
  }
  &:last-child {
    border-bottom: 0;
  }

  .video {
    width: 120px;
    height: 68px;
    position: relative;
    border-radius: 5px;
    margin-right: 5px;
    margin-right: 10px;
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
      width: 20px;
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
