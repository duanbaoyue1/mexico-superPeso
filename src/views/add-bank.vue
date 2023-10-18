<template>
  <div class="add-bank content-area" :class="{ 'from-order': from == 'order' }">
    <template v-if="from == 'order'">
      <div class="step">
        <complete-step :actionIndex="3"></complete-step>
      </div>
    </template>
    <div class="edit-area">
      <div class="line-item">
        <div class="label">Nombre de usuario</div>
        <input v-model="userInfo.customName" placeholder="Please enter your name" />
      </div>
    </div>
    <div class="select-area">
      <ul class="tab">
        <li :class="{ active: tab == 0 }" @click="tab = 0">Tarjeta de débito</li>
        <li :class="{ active: tab == 1 }" @click="tab = 1">Clabe</li>
      </ul>
      <div v-if="tab == 0">
        <div class="head">Nombre del Banco</div>
        <div class="line-item">
          <select-item :items="banks" :defaultValue="editData.bank" title="Nombre del Banco" itemAttrs="bank" @choose="chooseEditData" />
        </div>
        <div class="head">Número de cuenta bancaria</div>
        <div class="line-item">
          <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="16" v-model="editData.accountNumber" placeholder="Por favor escribe" />
        </div>
        <div class="head">Número de cuenta de entrada otra vez</div>
        <div class="line-item">
          <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="16" v-model="editData.accountNumberAgain" placeholder="Por favor escribe" />
        </div>
      </div>
      <div v-else>
        <div class="head">Nombre del Banco</div>
        <div class="line-item">
          <select-item :items="banks" title="Nombre del Banco" itemAttrs="bank" @choose="chooseEditData" />
        </div>
        <div class="head">Número digital clabe</div>
        <div class="line-item">
          <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="18" v-model="editData.accountNumber" placeholder="Por favor escribe" />
        </div>
        <div class="head">Número de cuenta de entrada otra vez</div>
        <div class="line-item">
          <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="18" v-model="editData.accountNumberAgain" placeholder="Por favor escribe" />
        </div>
      </div>
    </div>
    <div class="tips">
      Preste atención a lo siguiente:
      <br />
      1. Seleccione una de sus propias cuentas para recibir su préstamo.
      <br />
      2. Para evitar problemas de pago, si su cuenta es inválida o tiene algunos limites, intente agregar otra cuenta controlable.
      <br />
      3. Asegúrese de que la siguiente información sea correcta: Tipo de cuenta, Nombre bancario, Número de cuenta.
      <br />
      4. La información de su cuenta es segura, no dude en rellenarla.
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="showConfirmBank">Enviar</button>
    </div>

    <van-action-sheet class="bank-picker-sheet" v-model="openSelect" title="Elegir banco" close-on-click-action>
      <van-picker ref="bankPicker" class="bank-picker" :columns="banks" :item-height="75">
        <template #option="PickerOption">
          <div class="pick-value">
            <div>
              {{ PickerOption.text }}
              <span class="recommend" v-if="PickerOption.recommend">Recomendar</span>
            </div>
            <div>{{ PickerOption.desc || '1-2 días hábiles para llegar' }}</div>
          </div>
        </template>
      </van-picker>
      <div class="submit">
        <button class="bottom-submit-btn" @click="confirmSelect">Enviar</button>
      </div>
    </van-action-sheet>

    <van-popup v-model="showConfirmModal">
      <div class="confirm-data">
        <div class="content">
          <div class="line">
            <div class="label">Tipo</div>
            <div class="value">{{ tab == 0 ? 'Tarjeta de débito' : 'Clabe' }}</div>
          </div>
          <div class="line">
            <div class="label">Nombre del Banco</div>
            <div class="value">{{ editData.bank }}</div>
          </div>
          <div class="line">
            <div class="label">Número de cuenta</div>
            <div class="value">{{ editData.accountNumber }}</div>
          </div>
          <div class="tips">
            - Compruebe cuidadosamente la información anterior.
            <br />
            - Si la información de su cuenta bancaria es incorrecta, no podrá obtener un préstamo.
          </div>
        </div>
        <div class="actions">
          <button @click="submit">Confirmar</button>
          <button class="cancel" @click="showConfirmModal = false">Cancelar</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import ifscSelect from '@/components/ifsc-select.vue';
import CompleteStep from '@/components/complete-step.vue';
import * as ALL_ATTRS from '@/config/typeConfig';

export default {
  components: {
    ifscSelect,
    CompleteStep,
  },
  watch: {
    tab: {
      handler() {
        this.$set(this.editData, 'accountNumber', '');
        this.$set(this.editData, 'accountNumberAgain', '');
      },
      deep: true,
    },
    userInfo: {
      handler() {
        this.editData.userName = `${this.userInfo.identityName} ${this.userInfo.identityLastName}`;
      },
      deep: true,
    },
    editData: {
      handler() {
        this.canSubmit = this.editData.bank && this.editData.accountNumber && this.editData.accountNumber == this.editData.accountNumberAgain;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Información bancaria',
    });
  },
  data() {
    return {
      tab: 0,
      ALL_ATTRS: ALL_ATTRS,
      openSelect: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {
        userName: '',
        bank: '',
      },
      from: this.$route.query.from,
      orderId: this.$route.query.orderId,
      showConfirmModal: false,
      banks: [],
      saving: false,
    };
  },
  async mounted() {
    this.eventTracker('bank_add_access');
    this.queryBanks();
    if (this.from == 'order') {
      this.initInfoBackControl();
    }
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    async queryBanks(parentId) {
      parentId = parentId || '';
      // 查询所有的银行
      let data = await this.$http.post(`/api/remittance/remittanceBankList`, { parentId: parentId });
      this.banks = data.data.list.map(t => {
        return {
          label: t,
          value: t,
        };
      });
    },
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
    },
    confirmSelect() {
      this.eventTracker('bank_add_submit');
      this.selectBank = this.$refs.bankPicker.getValues()[0];
      this.openSelect = false;
    },
    showConfirmBank() {
      this.showConfirmModal = true;
      this.eventTracker('bank_add_submit');
    },

    async bindCardAndJump(cardId) {
      // 绑卡
      await this.$http.post(`/api/order/bindRemittanceAccount`, { remittanceAccountId: cardId, orderId: this.orderId });
      // 判断是否需要确认订单
      let appMode = await this.getAppMode();
      if (appMode.confirmType == 1) {
        // 需要进确认申请页
        this.innerJump('loan-confirm', { orderId: this.orderId }, true);
      } else {
        // 不需要进确认申请页
        this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: this.getLocalSystemTimeStamp() }, true);
      }
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      this.showLoading();
      try {
        this.eventTracker('bank_confirm_submit');
        let saveData = {
          accountNumber: this.editData.accountNumber,
          bank: this.editData.bank,
          name: this.userInfo.customName,
          type: this.tab,
        };
        console.log(this.tab, saveData.accountNumber.length);
        // 较验银行卡长度
        if ((this.tab == 0 && saveData.accountNumber.length != 16) || (this.tab == 1 && saveData.accountNumber.length != 18)) {
          this.showConfirmModal = false;
          this.$toast('Número de cuenta del recibo con formato incorrecto');
          return;
        }
        let data = await this.$http.post(`/api/remittance/addRemittanceAccount`, saveData);
        if (data.returnCode == 2000) {
          if (this.from == 'order') {
            this.bindCardAndJump(data.data.id);
          } else {
            this.goAppBack();
          }
        } else {
          throw new Error(data.message);
        }
        this.eventTracker('bank_add_submit_success');
      } catch (error) {
        this.showConfirmModal = false;
        this.eventTracker('bank_add_submit_error');
        this.$toast(error.message);
      } finally {
        this.saving = false;
        this.hideLoading();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.add-bank {
  padding: 10px 16px;
  padding-bottom: 110px;

  .bank-picker-sheet {
    height: 560px;
  }
  .bank-picker {
    position: absolute;
    bottom: 88px;
    left: 0;
    right: 0;
    top: 0;
  }

  .select-area {
    padding-top: 24px;
    border-top: 4px solid #eee;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;

    .tab {
      display: flex;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      justify-content: center;
      margin-bottom: 24px;
      li {
        flex: 1;
        text-align: center;
        position: relative;
        &.active {
          font-weight: bold;
          &::after {
            position: absolute;
            content: ' ';
            width: 56px;
            height: 12px;
            background: #43e0a2;
            border-radius: 6px;
            left: 50%;
            transform: translateX(-50%);
            bottom: -2px;
            z-index: -1;
          }
        }
      }
    }
    .head {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-bottom: 8px;
    }
    .line-item {
      margin-bottom: 24px;
      font-size: 14px;
      input {
        width: 100%;
        height: 52px;
        border-radius: 8px;
        border: 1px solid #eee;
        padding: 0 16px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }
  }

  .confirm-data {
    width: 327px;
    background: #ffffff;
    border-radius: 16px;
    .tips {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      margin-top: 16px;
      margin-bottom: 40px;
    }
    .content {
      padding: 24px;
      padding-bottom: 0;
      .line {
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
      }
    }
    .actions {
      margin-bottom: 16px;
      button {
        font-size: 16px;
        font-weight: 900;
        color: #ffffff;
        line-height: 20px;
        height: 36px;
        width: 279px;
        height: 36px;
        border: none;
        display: block;
        margin: 0 auto;
        background: #416cef;
        border-radius: 8px;
        &.cancel {
          background: transparent;
          color: #b0b0b0;
          font-weight: 400;
          margin-top: 10px;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 22;
    background: #fff;
  }

  .pick-value {
    > div {
      font-size: 10px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #a1a5fc;
      line-height: 16px;
      text-align: center;
      transform: scale(0.9);
      transition: all 0.3s;
      &:first-child {
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #9a9a9a;
        line-height: 20px;
        position: relative;

        .recommend {
          width: 74px;
          height: 28px;
          background: #ffdc62;
          border-radius: 8px 8px 8px 0px;
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
          line-height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: -40%;
          bottom: 0;
          transform: scale(0.9);
          opacity: 0.6;
        }
      }
    }
  }

  .tips {
    margin-top: 40px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
  }

  .pop-content {
    .items {
      margin-top: 42px;
      .item {
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-bottom: 36px;
        text-align: center;
        position: relative;
        span {
          position: relative;
        }

        &.active {
          font-weight: bold;
          color: #333333;
          span {
            &::after {
              position: absolute;
              content: ' ';
              width: 100%;
              height: 4px;
              background: #434af9;
              border-radius: 20px;
              bottom: -2px;
              left: 0;
            }
          }
        }
      }
    }
  }

  .edit-area {
    border-radius: 8px;
    padding-bottom: 24px;
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .line-item {
      font-size: 14px;
      padding-top: 23px;
      &.select-bank {
        position: relative;
        .right {
          position: absolute;
          right: 0px;
          bottom: 18px;
        }
      }
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        .color-red {
          color: #ff4b3f !important;
          font-size: 14px;
        }
      }
      input {
        width: 100%;
        height: 50px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        background: transparent;
      }
    }
  }
}
</style>
