<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="1"></complete-step>
    </div>

    <div class="edit-area-wrapper" v-for="(item, index) in contacts">
      <div class="edit-area-header">Contacto de emergencia {{ index + 1 }}</div>
      <div class="edit-area">
        <div class="line-item">
          <div class="desc">Elige el parentesco del contacto</div>
          <select-item :items="ALL_ATTRS.RELATION_SHIPS" title="Elige el parentesco del contacto" :itemAttrs="index" @choose="chooseRelation" />
        </div>
        <div class="line-item phone-select-wrapper" @click="choosePhone(index)">
          <div class="desc">Número de contacto</div>
          <input id="familyPhone" v-model="item.mobile" disabled placeholder="Por favor, elija" />
          <m-icon class="icon" type="superpeso/通讯录" :width="20" :height="20" />
        </div>
        <div class="line-item">
          <div class="desc">Nombre</div>
          <input v-model="item.name" placeholder="Por favor, elija" />
        </div>
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        ¡Enhorabuena!
        <br />
        Su información personal ha sido verificada
      </span>
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/select-item';
import * as ALL_ATTRS from '@/config/typeConfig';
import CompleteStep from '@/components/complete-step.vue';
const FIRST_GET_PHONE_KEY = 'is-getted-phone';

export default {
  components: {
    selectItem,
    CompleteStep,
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Información del contacto',
      backCallback: null,
    });
  },
  watch: {
    contacts: {
      handler() {
        console.log(this.contacts.filter(t => t.mobile).length);
        this.canSubmit = this.contacts.filter(t => t.mobile).length == this.contacts.length;
      },
      deep: true,
    },
  },
  data() {
    window.choosePhoneCallback = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let { mobile, name } = data;
      console.log(mobile);
      mobile = mobile.replace(/ /g, '');
      // 1. 验证号码是否有效
      if (mobile.length < 10 || mobile.length > 15) {
        this.showMessageBox({
          content: 'El número de móvil del contacto no está en el formato correcto, por favor, vuelva a seleccionarlo',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox();
          },
          iconPath: 'superpeso/校验错误弹窗提示',
          showClose: false,
        });
        return;
      }
      // 2. 验证是否有重复的
      let currentPhone = [...this.contacts].map(t => t.mobile);
      if (currentPhone.includes(mobile)) {
        this.showMessageBox({
          content: 'Número de móvil duplicado, seleccione otro contacto',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox();
          },
          iconPath: 'superpeso/紧急联系人手机号重复',
          showClose: false,
        });
        return;
      }
      this.contacts[this.lastPhoneIndex].mobile = mobile;
      this.contacts[this.lastPhoneIndex].name = name;
    };

    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: true, // 是否可以提交
      submitSuccess: false,
      contacts: [],
      lastPhoneIndex: 0,
      editData: {},
      saving: false,
    };
  },

  mounted() {
    this.getAppContactsNum();
    this.eventTracker('contact_access');
    this.initInfoBackControl();
  },

  methods: {
    async getAppContactsNum() {
      let contactsNum = 1;
      try {
        let res = await this.$http.post(`/api/app/getAppContactsNum`);
        contactsNum = res.data.num;
      } catch (error) {
      } finally {
        this.contacts = Array.from({ length: contactsNum }, (v, k) => k).map(t => {
          return { relation: '', mobile: '', name: '' };
        });
      }
    },
    chooseRelation(data) {
      this.contacts[data.attr].relation = data.value;
    },
    choosePhone(index) {
      this.lastPhoneIndex = index;
      let isGettedPhone = localStorage.getItem(FIRST_GET_PHONE_KEY);
      if (!isGettedPhone) {
        localStorage.setItem(FIRST_GET_PHONE_KEY, 'true');
        this.showMessageBox({
          content: 'Por favor, asegúrate de elegir un número de móvil real o el dinero no será liberado',
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            this.hideMessageBox();
            this.toAppMethod('getContactsContent', { fuName: 'choosePhoneCallback' });
          },
          iconPath: 'superpeso/第一次吊起通讯录',
          showClose: false,
        });
      } else {
        this.toAppMethod('getContactsContent', { fuName: 'choosePhoneCallback' });
      }
    },
    async submit() {
      this.showLoading();
      try {
        this.eventTracker('contact_submit');
        let saveData = { ...this.editData };
        let contacts = [...this.contacts];
        saveData.contacts = contacts;
        let data = await this.$http.post(`/api/user/basicInfo/save`, saveData);
        if (data.returnCode === 2000) {
          this.submitSuccess = true;
          this.eventTracker('contact_submit_success');
          setTimeout(() => {
            this.submitSuccess = false;
            this.innerJump('identity', { orderId: this.$route.query.orderId, from: 'order' }, true);
          }, 2000);
        }
      } catch (error) {
        this.eventTracker('contact_submit_error');
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px 0px;
  padding-bottom: 48px;
  overflow-y: auto;
  background: #fff;
  padding-top: 0;
  box-sizing: border-box;

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      width: 293px;
      height: 59px;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
    }
  }

  .edit-area-wrapper {
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 4px solid #eeeeee;
    padding-bottom: 16px;
    margin-bottom: 40px;
    &:last-of-type {
      border-bottom: none;
      margin-bottom: 0;
    }
    .edit-area-header {
      font-size: 16px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #416cef;
      line-height: 20px;
      margin-bottom: 16px;
    }
    .edit-area {
      background: #ffffff;

      .head {
        font-size: 14px;
        color: #000;
        line-height: 18px;
        margin-bottom: 10px;
      }

      .line-item {
        font-size: 14px;
        display: block;
        border-radius: 8px;
        margin-bottom: 24px;
        &:last-child {
          border-bottom: none;
        }
        .desc {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 20px;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          height: 100%;
          border: none;
          text-align: left;
          padding: 0 16px;
          height: 52px;
          font-size: 14px;
          color: #333333;
          box-sizing: border-box;
          border: 1px solid #eeeeee;
          border-radius: 8px;

          &:disabled {
            background: #fff;
          }
        }
      }

      .phone-select-wrapper {
        position: relative;
        .icon {
          position: absolute;
          bottom: 16px;
          right: 17px;
        }
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
    margin-bottom: 32px;
  }
}
</style>
