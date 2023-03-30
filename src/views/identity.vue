<template>
  <div class="information">
    <div class="step">
      <m-icon class="icon" type="information/step1" :width="98" :height="28" />
      <span>(&nbsp;A total of 4 steps are required&nbsp;)</span>
    </div>
    <div class="edit-area">
      <div class="head-top">Identity Info</div>
      <div class="pan-img">
        <template v-if="panFrontBase64Src">
          <img class="back user-pic" :src="panFrontBase64Src" />
          <img class="btn" :src="require('@/assets/img/identity/uploaded.png')" />
        </template>
        <template v-else>
          <img class="back" :src="require('@/assets/img/identity/pan-front.png')" />
          <img class="btn" @click="getCapture(3)" :src="require('@/assets/img/identity/photo@2x.png')" />
        </template>
      </div>
      <div class="pan-text">
        Pan
        <span>Front</span>
      </div>
      <div class="pan-demo">
        <div>
          <img class="btn" :src="require('@/assets/img/identity/Standard@2x.png')" />
          <div>Standard</div>
        </div>
        <div>
          <img class="btn" :src="require('@/assets/img/identity/Missing border@2x.png')" />
          <div>Missing border</div>
        </div>
        <div>
          <img class="btn" :src="require('@/assets/img/identity/Blurred photo@2x.png')" />
          <div>Blurred photo</div>
        </div>
        <div>
          <img class="btn" :src="require('@/assets/img/identity/Strong flash@2x.png')" />
          <div>Strong flash</div>
        </div>
      </div>
      <div class="pan-tips">
        1.Ensure that all the documents uploaded are clear and not blurred
        <br />
        2.Incomplete information may prevent you from passing thecetification successfully
      </div>
    </div>
    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <div class="submit-success-content">
        <div class="percent">
          <div class="cur-percent" :style="{ width: curPercent + '%' }"></div>
          <div class="tips" :style="{ left: curPercent + '%' }">{{ curPercent }}%</div>
        </div>
        <div class="tips">
          Please be patient and wait for the
          <br />
          upload to unlock the credit
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    window.onPhotoSelectCallback_3 = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.canSubmit = true;
        this.panFrontBase64Src = `data:image/png;base64,${data.base64}`;
      }
    };

    window.onPhotoSelectCallback_4 = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.uploadImg(4, 'livingBase64Src', `data:image/png;base64,${data.base64}`);
      }
    };

    // 用户点击回退回调
    window.backBtnHandler = async data => {
      this.showMessageBox({
        content: 'Receive the money immediately after submitting the information. Do you really want to quit?',
        confirmBtnText: 'Yes',
        confirmCallback: () => {
          this.hideMessageBox();
          this.goAppBack();
        },
        iconPath: 'message/question',
        showClose: true,
      });
    };

    return {
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      panFrontBase64Src: '',
      editData: {},
      curPercent: 0,
      saving: false,
      curInterval: null,
      ocrChannel: 'AccV2'
    };
  },

  mounted() {
    this.toAppMethod('needBackControl', { need: true });
    // this.getOcrChannel();
  },

  methods: {
    // async getOcrChannel() {
    //   try {
    //     let res = await this.$http.post(`/zds/htgfuvs`);
    //     if (res.returnCode == 2000) {
    //       this.ocrChannel = res.data.channel;
    //     }
    //   } catch (error) {}
    // },

    getCapture(type) {
      if (type == 3) {
        this.eventTracker('id_pan_front');
      }
      this.toAppMethod('getCapture', { type: type, callbackMethodName: `onPhotoSelectCallback_${type}` });
    },

    startPercent() {
      this.curPercent = 1;
      this.submitSuccess = true;
      if (this.curInterval) {
        window.clearInterval(this.curInterval);
        this.curInterval = null;
      }
      this.curInterval = setInterval(() => {
        if (this.curPercent != 99) {
          this.curPercent += 1;
        } else {
          this.stopPercent();
        }
      }, 100);
    },

    stopPercent() {
      window.clearInterval(this.curInterval);
    },

    async showUploadSuccess() {
      this.stopPercent();
      this.curPercent = 100;
      try {
        // 创建订单
        let res = await this.$http.post(`/xiaqpdt/bmzxwlxmjhahf`);
        this.submitSuccess = false;
        console.log('创建订单信息结果:', res);
        // 跳转个人信息页
        console.log('订单创建结果:', res);
        this.innerJump('information', { orderId: res.data.orderId }, true);
      } catch (error) {
        this.$toast(error.message);
      }
    },

    async uploadImg(type, fileName, base64) {
      if (type == 3) {
        this.showLoading();
      } else {
        // 上传活动后显示进度条
        this.startPercent();
      }
      try {
        let formData = new FormData();
        formData.append('channel', this.ocrChannel);
        formData.append(fileName, base64);
        formData.append('mark', type);

        let res = await this.$http.post(`/zds/ewcaqwrubmcvlgpo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.returnCode == 2000) {
          if (type == 3 && res.data.panFrontOcrStatus) {
            // 活体检测
            this.getCapture(4);
          } else if (type == 4 && res.data.faceComparisonStatus) {
            this.showUploadSuccess();
          } else {
            this.$toast('please try again!');
            this.stopPercent();
            this.submitSuccess = false;
          }
        } else {
          this.$toast(error.message);
          this.stopPercent();
          this.submitSuccess = false;
        }
      } catch (error) {
        this.$toast(error.message);
        this.stopPercent();
        this.submitSuccess = false;
      } finally {
        this.hideLoading();
      }
    },

    async submit() {
      this.eventTracker('id_submit');
      this.uploadImg(3, 'panFrontBase64Src', this.panFrontBase64Src);
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px;
  padding-bottom: 110px;

  .pan-text {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    margin: 10px auto 30px;
    text-align: center;
    span {
      color: #fd973f;
    }
  }

  .pan-tips {
    margin-top: 20px;
    font-size: 10px;
    font-weight: 400;
    color: #c6c6c6;
    line-height: 14px;
  }

  .pan-demo {
    display: flex;
    align-items: center;
    font-size: 10px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    > div {
      white-space: nowrap;
      text-align: center;
      flex: 1;
      img {
        width: 70px;
        height: 58px;
        margin: 0 auto;
        margin-bottom: 4px;
        display: block;
      }
    }
  }

  .pan-img {
    position: relative;
    .back {
      width: 190px;
      height: 120px;
      margin: 0 auto;
      display: block;
      &.user-pic {
        height: 190px;
        width: 120px;
        transform: rotate(270deg);
        transform-origin: center center;
      }
    }
    .btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
    }
  }

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    &-content {
      width: 320px;
      height: 144px;
      background: #ffffff;
      border-radius: 8px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 400;
      color: #000601;
      line-height: 20px;
      .percent {
        width: 280px;
        height: 10px;
        background: #e6ebf5;
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 54px;
        margin-bottom: 20px;
        position: relative;
        .cur-percent {
          height: 10px;
          background: #1143a4;
          border-radius: 5px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .tips {
          position: absolute;
          top: -30px;
          width: 36px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
          border-radius: 3px;
          background: #333333;
          transform: translateX(-50%);
          &::after {
            position: absolute;
            content: ' ';
            border-style: solid;
            border-width: 6px;
            border-color: #333333 transparent transparent transparent;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .tips {
        text-align: center;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    button {
      margin: 20px 20px 20px;
      height: 48px;
      width: 320px;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 900;
      background: #1143a4;
      color: #fff;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      box-sizing: border-box;
      padding: 0;
      &:disabled {
        background: #e9e9e9;
        color: #999999;
      }
    }
  }
  .step {
    margin-top: 25px;
    margin-bottom: 30px;
    font-size: 10px;
    font-weight: 400;
    color: #87a0d1;
    line-height: 18px;
    display: flex;
    align-items: end;
    .icon {
      margin-right: 6px;
    }
    span {
      transform: scale(0.9);
    }
  }
  .edit-area {
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
  }
}
</style>
