<template>
  <div class="video-module">
    <div class="video" v-for="(item, index) in videos.slice(0, 4)" :key="item.id" @click="play(index)">
      <img class="poster" :src="item.imageUrl" />
      <img class="play" :src="require('@/assets/img/play@2x.png')" />
      <div class="title">{{ item.title }}</div>
    </div>
    <div class="show-all" v-if="videos.length > 4" @click="play(4)">
      <span>更多案例</span>
      <img :src="require('@/assets/img/web/arrow@2x.png')" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videos: {
      type: Array
    }
  },
  data() {
    return {
      total: 2,
      index: 0
    };
  },
  methods: {
    play(index) {
      this.$emit('play', index);
    }
  },
};
</script>

<style lang="scss" scoped>
.video-module {
  display: flex;
  .show-all {
    width: 30px;
    height: 96px;
    background: transparent;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
    line-height: 16px;
    padding: 9px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    border: 1px solid rgba(220, 188, 168, 0.45);
    margin-left: 5px;
    margin-top: 20px;
    img {
      width: 9px;
      margin-top: 5px;
    }
  }
  .video {
    width: 260px;
    height: 146px;
    position: relative;
    border-radius: 5px;
    margin-right: 15px;
    cursor: pointer;
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
      width: 36px;
      cursor: pointer;
    }
    .title {
      font-size: 13px;
      color: #ffffff;
      line-height: 16px;
      position: absolute;
      bottom: 0;
      padding: 6px 0;
      left: 0;
      right: 0;
      text-align: center;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
      border-radius: 0 0 5px 5px;
    }
  }
}
</style>
