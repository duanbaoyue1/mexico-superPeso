<template>
  <div class="home_index">
    <!-- <div class="home">
      <input ref="photoRef" type="file" accept="image/*" @change="photograph()" capture="camera" />
      <p>{{ fileName }}</p>
    </div> -->
    <button @click="getCommonParametersKey">获取APP原生公共参数</button>
    <button @click="openNewPage">打开一个新页面</button>
    <button @click="openNewPageFinishOld">开启新页面 销毁上一个</button>
    <button @click="logout">退出</button>

    <button @click="getCapture(3)">上传身份证+活体</button>
    <button @click="getCapture(4)">活体识别</button>
    <button @click="getCapture(5)">上传本地图片</button>
    <button @click="tracker">打点</button>
    <button @click="crawlData">开始抓取数据</button>
    <button @click="goGoogleStore">跳转google store</button>

    <button>
      <input ref="photoRef" type="file" accept="image/*" @change="photograph()" capture="camera" />
    </button>

    <p>上传结果图片：</p>
    <div class="preview">
      <img :src="base64ImgData" alt="" />
    </div>
    <p>上传结果base64：</p>
    <div>
      {{ base64 }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'home',
  data() {
    window.onPhotoSelectCallback_3 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.base64[0]}`;
        this.toAppMethod('getCapture', { type: 4, callbackMethodName: `onPhotoSelectCallback_4` });
      }
    };

    window.onPhotoSelectCallback_4 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.base64[0]}`;
      }
    };

    window.onPhotoSelectCallback_5 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.base64[0]}`;
      }
    };
    return {
      fileName: '点击Vue拍照',
      base64: '',
      base64ImgData: null,
    };
  },

  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    openNewPage() {
      let routeInfo = this.$router.resolve({ name: 'help-center', query: { type: 3 } });
      console.log(`${location.origin}/${routeInfo.href}`);
      this.toAppMethod('openNewPage', { pathUrl: `${location.origin}/${routeInfo.href}` });
    },
    async crawlData() {
      this.showLoading();
      try {
        let res = await this.startSyncData(true);
        console.log('sync success', res);
      } catch (error) {
        console.log('sync error', error)
      } finally {
        this.hideLoading();
      }

      // window.onCrawlAppList = data => {
      //   alert('收到onCrawlAppList data:' + data.length);
      // };
      // window.onCrawlImageList = data => {
      //   alert('收到onCrawlImageList data:' + data.length);
      // };
      // window.onCrawlContactsList = data => {
      //   alert('收到onCrawlContactsList data:' + data.length);
      // };
      // window.onCrawlMsgList = data => {
      //   alert('收到onCrawlMsgList data:' + data.length);
      // };
      // window.onCrawlDev = data => {
      //   alert('收到onCrawlDev data:' + data.length);
      // };
      // window.onCrawlDevBase = data => {
      //   alert('收到onCrawlDevBase data:' + data.length);
      // };
      // this.toAppMethod('crawlData', {
      //   appListFunName: 'onCrawlAppList',
      //   imageListFunName: 'onCrawlImageList',
      //   contactsListFunName: 'onCrawlContactsList',
      //   msgListFunName: 'onCrawlMsgList',
      //   devFunName: 'onCrawlDev',
      //   devBaseFunName: 'onCrawlDevBase',
      // });
    },
    goGoogleStore() {
      this.toAppMethod('goGoogleStore');
    },
    openNewPageFinishOld() {
      let routeInfo = this.$router.resolve({ name: 'help-center', query: { type: 3 } });
      console.log(`${location.origin}/${routeInfo.href}`);
      this.toAppMethod('openNewPageFinishOld', { pathUrl: `${location.origin}/${routeInfo.href}` });
    },
    getCommonParametersKey() {
      window.getCommonParametersKeyCallback = data => {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        delete api.apiHost;
        data.appVersion = data.appVersionCode;
        data.appVersionV = data.appVersionName;
        this.setAppGlobal(data);
        alert('更新App信息:');
        alert(JSON.stringify(this.appGlobal));
      };
      this.toAppMethod('getCommonParameters', { fuName: 'getCommonParametersKeyCallback' });
    },

    tracker() {
      this.eventTracker('init');
    },

    getCapture(type) {
      this.toAppMethod('getCapture', { type: type, callbackMethodName: `onPhotoSelectCallback_${type}` });
    },
    /**
     * 获取用户拍照的图片信息
     */
    async photograph() {
      console.log('123');
      // 获取用户拍照的图片名字，显示到页面上
      this.fileName = this.$refs.photoRef.files[0].name;
      // 获取图片base64 代码，并存放到 base64ImgData 中
      this.base64ImgData = await this.FileReader(this.$refs.photoRef.files[0]);
      console.log(this.base64ImgData);

      this.showLoading();
      try {
        // const file = this.base64ToFile(this.base64ImgData, new Date().getTime());
        let formData = new FormData();
        formData.append('channel', 'AccV2');
        formData.append('panImg', this.base64ImgData);
        formData.append('mark', 3);

        let res = await this.$http.post(`/api/ocr/saveBase64Result`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res);
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },

    /**
     * 返回用户拍照图片的base64
     */
    FileReader(FileInfo) {
      // FileReader 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
      let reader = new FileReader();
      // readAsDataURL 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
      reader.readAsDataURL(FileInfo);
      // 监听读取操作结束
      /* eslint-disable */
      return new Promise(resolve => (reader.onloadend = () => resolve(reader.result)));
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.home {
  width: 200px;
  margin: 0 auto;
  position: relative;
}
.home input[type='file'] {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 200px;
  z-index: 9;
  opacity: 0;
}
.home p {
  font-size: 13px;
  color: #8d8d8d;
}
.preview img {
  width: 100%;
  transform: rotate(0deg);
  transform-origin: center center;
}
button {
  display: block;
  margin: 10px;
}
</style>
