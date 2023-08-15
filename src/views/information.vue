<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="0"></complete-step>
    </div>
    <div class="edit-area">
      <!-- <div class="line-item">
        <input v-model="editData.firstName" placeholder="Please enter your name" />
      </div>
      <div class="line-item">
        <input v-model="editData.middleName" placeholder="Please enter your Middle Name" />
      </div>
      <div class="line-item">
        <input v-model="editData.lastName" placeholder="Please enter your Last Name" />
      </div> -->
      <div class="head">Contacto Nombre</div>
      <div class="line-item">
        <input v-model="editData.name" placeholder="Por favor escribe" />
      </div>
      <div class="head">Formación académica</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.EDUCATION" title="Formación académica" itemAttrs="education" @choose="chooseEditData" />
      </div>
      <!-- <div class="head">Gender</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.GENDER" itemAttrs="gender" @choose="chooseEditData" />
      </div> -->
      <div class="head">Estado civil</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.MARITAL_STATUS" title="Estado civil" itemAttrs="marital" @choose="chooseEditData" />
      </div>
      <div class="head">Finalidad del préstamo</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.LOAN_PURPOSE" title="Finalidad del préstamo" itemAttrs="loanPurpose" @choose="chooseEditData" />
      </div>
      <div class="head">Tipo de alojamiento</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.ACCOMMODATION" title="Tipo de alojamiento" itemAttrs="houseType" @choose="chooseEditData" />
      </div>
      <div class="head">Ingresos mensuales</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.SALARY" title="Ingresos mensuales" :columns="1" itemAttrs="monthlyIncome" @choose="chooseEditData" />
      </div>
      <div class="head">Occupation</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.OCCUPATION" title="Occupation" itemAttrs="occupation" @choose="chooseEditData" />
      </div>

      <!-- <div class="head">Number of Children</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.CHILDREN" itemAttrs="childNum" @choose="chooseEditData" />
      </div>
      <div class="head">Pay Method</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.PAY_METHOD" itemAttrs="incomeWay" @choose="chooseEditData" />
      </div> -->
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
import CompleteStep from '@/components/complete-step.vue';
import * as ALL_ATTRS from '@/config/typeConfig';
import eventTrack from '@/mixins/event-track';

export default {
  mixins: [eventTrack],
  components: {
    selectItem,
    CompleteStep,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length == 7;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Complete information',
      backCallback: null,
    });
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {},
      saving: false,
      orderId: this.$route.query.orderId,
    };
  },
  mounted() {
    this.eventTracker('basic_access');
    this.initInfoBackControl();
  },
  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('basic_submit');
        let saveData = { ...this.editData };
        if (!this.validateEmail(saveData.email)) {
          this.$toast('Please enter the correct email address.');
          return;
        }
        let data = await this.$http.post(`/api/user/basicInfo/save`, saveData);
        if (data.returnCode == 2000) {
          this.eventTracker('basic_submit_success');
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
            this.innerJump('contacts', { orderId: this.orderId }, true);
          }, 1000);
        }
      } catch (error) {
        this.eventTracker('basic_submit_error');
        this.$toast(error.message);
      } finally {
        this.saving = false;
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
  padding-top: 0;

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
  .edit-area {
    .head-top {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .head {
      font-size: 14px;
      color: #333;
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
}
</style>
