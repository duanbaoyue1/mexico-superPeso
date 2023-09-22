<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="2"></complete-step>
    </div>
    <div class="edit-area">
      <div class="pan-img-wrapper">
        <div class="pan-img" @click="getCapture(1)">
          <template v-if="cardFrontOcrStatus">
            <img class="back" :src="cardFrontBase64Src" />
            <img class="btn" :src="require('@/assets/img/superpeso/完成.png')" />
          </template>
          <template v-else>
            <img class="back" :src="require('@/assets/img/superpeso/卡正.png')" />
            <img class="btn" :src="require('@/assets/img/superpeso/相机.png')" />
          </template>
        </div>
        <div class="pan-text">Front of INE / IFE</div>
      </div>

      <!-- <div class="pan-img-wrapper">
        <div class="pan-img" @click="getCapture(2)">
          <template v-if="cardBackOcrStatus">
            <img class="back" :src="cardBackBase64Src" />
            <img class="btn" :src="require('@/assets/img/superpeso/完成.png')" />
          </template>
          <template v-else>
            <img class="back" :src="require('@/assets/img/superpeso/卡反.png')" />
            <img class="btn" :src="require('@/assets/img/superpeso/相机.png')" />
          </template>
        </div>
        <div class="pan-text">Back of INE / IFE</div>
      </div> -->

      <div class="pan-info" v-if="cardFrontOcrStatus">
        <div class="item">
          <label>Nombre</label>
          <div class="value">{{ cardFrontOcrInfo.realName }}</div>
        </div>
        <div class="item">
          <label>Apellido paterno</label>
          <div class="value">{{ cardFrontOcrInfo.fatherName }}</div>
        </div>
        <div class="item">
          <label>Apellido materno</label>
          <div class="value">{{ cardFrontOcrInfo.motherName }}</div>
        </div>
        <div class="item">
          <label>CURP</label>
          <div class="value">{{ cardFrontOcrInfo.idNumber }}</div>
        </div>
        <div class="item">
          <label>RFC</label>
          <div class="value">
            {{ cardFrontOcrInfo.idNumber.slice(0, 10) }}
            <input class="RFC" v-model="rfc" @keyup="checkCanSubmit" placeholder="RFC" />
          </div>
        </div>
        <div class="tips">Los últimos 3 dígitos del RFC deben ser introducidos</div>
      </div>

      <div class="pan-tips">Confirme la información básica de acuerdo con la identificación con foto cargada. Asegúrese de que la información básica sea consistente con su identificación con foto, de lo contrario afectará su préstamo.</div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <div class="submit-success-content">
        <div class="percent">
          <div class="cur-percent" :style="{ width: curPercent + '%' }"></div>
          <div class="tips" :style="{ left: curPercent + '%' }">{{ curPercent }}%</div>
        </div>
        <div class="tips">Please be patient and wait for the upload to unlock the credit</div>
        <m-icon class="close" type="superpeso/弹窗关闭" :width="24" :height="24" @click="submitSuccess = false" />
      </div>
    </div>
  </div>
</template>

<script>
import CompleteStep from '@/components/complete-step.vue';

export default {
  components: {
    CompleteStep,
  },

  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Información sobre la identidad',
      backCallback: null,
    });
  },
  data() {
    window.onPhotoSelectCallback_1 = data => {
      this.hideLoading();
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_ine_front_submit');
        this.cardFrontBase64Src = `data:image/png;base64,${data.pic}`;
        this.uploadImg(1, 'cardFrontBase64Src', this.cardFrontBase64Src);
      }
    };

    window.onPhotoSelectCallback_2 = data => {
      this.hideLoading();
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_card_back_submit');
        this.cardBackBase64Src = `data:image/png;base64,${data.pic}`;
        this.uploadImg(2, 'cardBackBase64Src', this.cardBackBase64Src);
      }
    };

    window.onPhotoSelectCallback_4 = data => {
      this.hideLoading();
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_liveness_photo_submit');
        // this.uploadImg(4, 'livingBase64Src', `data:image/png;base64,${data.pic}`);
        this.uploadImg(4, 'livenessId', data.livenessId);
      }
    };

    window.onPhotoBackCallback = data => {
      this.showLoading();
    };

    return {
      canSubmit: false,
      submitSuccess: false,
      cardFrontBase64Src: '',
      cardBackBase64Src: '',
      editData: {},
      curPercent: 0,
      saving: false,
      rfc: '',
      cardFrontOcrInfo: {
        idNumber: '',
      },
      license: '',
      curInterval: null,
      cardFrontOcrStatus: 0,
      cardBackOcrStatus: 0,
      orderId: this.$route.query.orderId,
    };
  },

  mounted() {
    document.body.style.backgroundColor = '#fff';
    this.eventTracker('id_access');
    this.initInfoBackControl();
    this.getLicense();
  },

  methods: {
    async getLicense() {
      try {
        let res = await this.$http.post(`/api/ocr/advanceLicense`);
        this.license = res.data.license;
      } catch (error) {}
    },

    getCapture(type) {
      if (type == 1) {
        this.eventTracker('id_ine_front');
      } else if (type == 2) {
        this.eventTracker('id_card_back');
      }

      let params = { type: type, callbackMethodName: `onPhotoSelectCallback_${type}`, license: this.license };
      params.photoBackMethodName = 'onPhotoBackCallback';
      this.toAppMethod('getCapture', params);
    },

    startPercent() {
      this.curPercent = 1;
      this.submitSuccess = true;
      if (this.curInterval) {
        window.clearInterval(this.curInterval);
        this.curInterval = null;
      }
      this.curInterval = setInterval(() => {
        if (this.curPercent < 99) {
          this.curPercent += 1;
        } else {
          this.stopPercent();
        }
      }, 100);
    },

    stopPercent() {
      window.clearInterval(this.curInterval);
    },

    async goAddCard() {
      try {
        // 创建订单
        let res = await this.$http.post(`/api/product/appMaskModelNew`);
        console.log('订单创建结果:', res);
        this.eventTracker('id_submit_create_order_success');
        this.submitSuccess = false;
        this.innerJump('add-bank', { orderId: res.data.orderId, from: 'order' }, true);
      } catch (error) {
        this.submitSuccess = false;
        this.$toast(error.message);
      }
    },

    async uploadImg(type, fileName, fileContent) {
      // 上传活动后显示进度条
      this.startPercent();
      try {
        let saveData = {
          mark: type,
        };
        saveData[fileName] = fileContent;
        let res = await this.$http.post(`/api/ocr/saveResult`, saveData);

        if (res.returnCode == 2000) {
          if (type == 1) {
            this.cardFrontOcrStatus = res.data.cardFrontOcrStatus;
            this.cardFrontOcrInfo = res.data.cardFrontOcrInfo;
          } else if (type == 2) {
            this.cardBackOcrStatus = res.data.cardBackOcrStatus;
          }
          if (type == 1 && res.data.cardFrontOcrStatus) {
            this.curPercent = 100;
            setTimeout(() => {
              this.stopPercent();
              this.submitSuccess = false;
            }, 1000);
            this.eventTracker('id_ine_front_submit_success');
          } else if (type == 2 && res.data.cardBackOcrStatus) {
            this.curPercent = 100;
            setTimeout(() => {
              this.stopPercent();
              this.submitSuccess = false;
            }, 1000);
            this.eventTracker('id_card_back_submit_success');
          } else if (type == 4 && res.data.livingStatus) {
            // 提交人脸对比请求
            res = await this.$http.post(`/api/ocr/saveResult`, { mark: 5 });
            if (res.data.faceComparisonStatus) {
              this.curPercent = 100;
              this.eventTracker('id_liveness_success');
              this.goAddCard();
            } else {
              this.logError(type);
            }
          } else {
            this.logError(type);
          }
        } else {
          this.logError(type);
        }
      } catch (error) {
        this.logError(type, error);
      } finally {
        this.checkCanSubmit();
      }
    },

    checkCanSubmit() {
      if (this.cardFrontOcrStatus && this.rfc) {
        this.canSubmit = true;
      } else {
        this.canSubmit = false;
      }
    },

    logError(type, error) {
      this.stopPercent();
      this.submitSuccess = false;
      this.eventTracker('id_submit_error');
      let toastMessage = 'Por favor, inténtelo de nuevo！';

      if (error) {
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          toastMessage = 'Compruebe la red y vuelva a intentarlo';
        } else {
          toastMessage = error.message || toastMessage;
        }
      }
      this.$toast(toastMessage);
    },

    async submit() {
      this.eventTracker('id_submit');
      if (!this.rfc) {
        this.$toast('please input rfc!');
        return;
      }
      try {
        let saveData = {
          mark: 3,
          rfc: `${this.cardFrontOcrInfo.idNumber.slice(0, 10)}${this.rfc}`,
        };
        let res = await this.$http.post(`/api/ocr/saveResult`, saveData);
        if (res.returnCode == 2000) {
          this.getCapture(4);
        } else {
          this.$toast('error!');
        }
      } catch (error) {
        this.$toast(error.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px 16px;
  padding-bottom: 110px;
  background: #fff;

  .pan-text {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    margin: 10px auto 0px;
    text-align: center;
    span {
      color: #fd973f;
    }
  }

  .pan-info {
    margin-top: 20px;
    border-top: 4px solid #eee;
    padding: 40px 16px 20px;
    margin-left: -16px;
    margin-right: -16px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      margin-bottom: 30px;
      .RFC {
        color: #f95502;
        margin-left: 4px;
        width: 30px;
        border: none;
        text-align: right;
        &::-webkit-input-placeholder {
          color: #f95502;
        }
        &::-moz-placeholder {
          color: #f95502;
        }
        &::-moz-placeholder {
          color: #f95502;
        }
        &:-ms-input-placeholder {
          color: #f95502;
        }
        &:focus::-webkit-input-placeholder {
          color: transparent;
        }
        &:focus:-moz-placeholder {
          color: transparent;
        }
        &:focus::-moz-placeholder {
          color: transparent;
        }
        &:focus:-ms-input-placeholder {
          color: transparent;
        }
      }
    }
    .tips {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #f95502;
      line-height: 18px;
      margin-top: -20px;
      text-align: right;
    }
  }

  .pan-tips {
    margin-top: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #999;
    word-break: break-word;
    line-height: 18px;
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

  .pan-img-wrapper {
    background: #fff;
    padding: 20px 44px;
    border-radius: 8px;

    .pan-img {
      position: relative;
      .back {
        width: 175px;
        height: 120px;
        margin: 0 auto;
        display: block;
      }
      .btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
      }
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
    .close {
      position: absolute;
      bottom: -62px;
      left: 50%;
      z-index: 2;
      transform: translateX(-50%);
    }

    &-content {
      width: 320px;
      height: 144px;
      background: #ffffff;
      border-radius: 16px;
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
          background: linear-gradient(270deg, #434af9 0%, #696ffb 100%);
          border-radius: 5px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .tips {
          position: absolute;
          top: -30px;
          width: 36px;
          margin-left: 0px;
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
        margin: 0 24px;
        word-break: break-word;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
  }
  .step {
    padding-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
