<template>
  <div class="home_index">
    <!-- <div class="home">
      <img alt="Vue logo" src="../assets/logo.png" />
      <input ref="photoRef" type="file" accept="image/*" @change="photograph()" capture="camera" />
      <p>{{ fileName }}</p>
    </div> -->
    <button @click="getCapture(3)">上传身份证+活体</button>
    <br />
    <button @click="getCapture(4)">活体识别</button>
    <br />
    <button @click="getCapture(5)">上传本地图片</button>
    <br />
    <br />

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
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
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
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
      }
    };

    window.onPhotoSelectCallback_5 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
      }
    };
    return {
      fileName: '点击Vue拍照',
      base64: '',
      base64ImgData: '',
    };
  },

  methods: {
    getCapture(type) {
      this.toAppMethod('getCapture', { type: type, callbackMethodName: `onPhotoSelectCallback_${type}` });
    },
    /**
     * 获取用户拍照的图片信息
     */
    async photograph() {
      // 获取用户拍照的图片名字，显示到页面上
      this.fileName = this.$refs.photoRef.files[0].name;
      // 获取图片base64 代码，并存放到 base64ImgData 中
      this.base64ImgData = await this.FileReader(this.$refs.photoRef.files[0]);
      console.log(this.base64ImgData);

      const file = this.$refs.photoRef.files[0];
      let formData = new FormData();
      formData.append('channel', 'Acc');
      formData.append('panImg', file);
      formData.append('mark', 3);
      console.log(formData.get('mark'));
      let res = await this.$http.post(`/zds/ewcahvrche`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(res);
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

<style scope>
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
}
</style>
