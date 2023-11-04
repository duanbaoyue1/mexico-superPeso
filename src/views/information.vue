<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="0"></complete-step>
    </div>
    <div class="edit-area">
      <div class="head">Formación académica</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.EDUCATION" :defaultOpen="curOpenFields == 'education'" title="Formación académica" itemAttrs="education" @choose="chooseEditData" />
      </div>
      <div class="head">Estado civil</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.MARITAL_STATUS" :defaultOpen="curOpenFields == 'marital'" title="Estado civil" itemAttrs="marital" @choose="chooseEditData" />
      </div>
      <div class="head">Finalidad del préstamo</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.LOAN_PURPOSE" :defaultOpen="curOpenFields == 'loanPurpose'" title="Finalidad del préstamo" itemAttrs="loanPurpose" @choose="chooseEditData" />
      </div>
      <div class="head">Tipo de alojamiento</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.ACCOMMODATION" :defaultOpen="curOpenFields == 'liveType'" title="Tipo de alojamiento" itemAttrs="liveType" @choose="chooseEditData" />
      </div>
      <div class="head">Ingresos mensuales</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.SALARY" :defaultOpen="curOpenFields == 'monthlyIncome'" title="Ingresos mensuales" :columns="1" itemAttrs="monthlyIncome" @choose="chooseEditData" />
      </div>
      <div class="head">Occupation</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.OCCUPATION" :defaultOpen="curOpenFields == 'occupation'" title="Ocupación" itemAttrs="occupation" @choose="chooseEditData" />
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
import CompleteStep from '@/components/complete-step.vue';
import * as ALL_ATTRS from '@/config/typeConfig';
const ALL_FIELD = ['education', 'marital', 'loanPurpose', 'liveType', 'monthlyIncome', 'occupation'];

export default {
  components: {
    selectItem,
    CompleteStep,
  },
  data() {
    return {
      curOpenFields: 'education',
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {},
      saving: false,
      orderId: this.$route.query.orderId,
    };
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length == 6;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Información personal',
      backCallback: null,
    });
  },
  mounted() {
    this.setEventTrackStartTime();

    this.eventTracker('basic_access');
    this.initInfoBackControl();
  },
  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
      let index = ALL_FIELD.indexOf(data.attr);
      if (index == ALL_FIELD.length - 1) {
        this.curOpenFields = '';
      } else {
        this.curOpenFields = ALL_FIELD[index + 1];
      }
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('basic_submit');
        let saveData = { ...this.editData };
        let data = await this.$http.post(`/api/user/addInfo/save`, saveData);
        if (data.returnCode == 2000) {
          this.eventTracker('basic_submit_success');
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;

            this.sendEventTrackData({ leaveBy: 1 });

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
    margin-left: -16px;
    margin-right: -16px;
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
