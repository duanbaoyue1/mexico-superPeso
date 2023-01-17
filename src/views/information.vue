<template>
  <div class="information">
    <div class="step">
      <m-icon class="icon" type="information/step2" :width="98" :height="28" />
      <span>(&nbsp;A total of 4 steps are required&nbsp;)</span>
    </div>
    <div class="edit-area">
      <div class="head-top">Personal Info</div>
      <div class="line-item">
        <input v-model="editData.firstName" placeholder="Please enter your name" />
      </div>
      <div class="line-item">
        <input v-model="editData.middleName" placeholder="Please enter your Middle Name" />
      </div>
      <div class="line-item">
        <input v-model="editData.lastName" placeholder="Please enter your Last Name" />
      </div>
      <div class="line-item">
        <input v-model="editData.email" placeholder="Please enter your Email" />
      </div>
      <div class="head">Education</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.EDUCATION" itemAttrs="education" @choose="chooseEditData" />
      </div>
      <div class="head">Occupation</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.OCCUPATION" itemAttrs="occupation" @choose="chooseEditData" />
      </div>
      <div class="head">Salary Range</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.SALARY" itemAttrs="monthlyIncome" @choose="chooseEditData" />
      </div>
      <div class="head">Marital Status</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.MARITAL_STATUS" itemAttrs="marital" @choose="chooseEditData" />
      </div>
      <div class="head">Loan Purpose</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.LOAN_PURPOSE" :columns="1" itemAttrs="loanPurpose" @choose="chooseEditData" />
      </div>
    </div>
    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span> Congratulations! <br />Your personal information has been verified </span>
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/select-item';
import * as ALL_ATTRS from '@/config/typeConfig';
export default {
  components: {
    selectItem,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length == 9;
      },
      deep: true,
    },
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {},
    };
  },
  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
    },
    async submit() {
      let saveData = { ...this.editData };
      if (!this.validateEmail(saveData.email)) {
        this.$toast('Please enter the correct email address');
        return;
      }

      try {
        let data = await this.$http.post(`/clyb/nwwwddejj/ewca`, saveData);
        if (data.returnCode == 2000) {
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
            this.innerJump('contacts', { orderId: this.$route.query.orderId }, true);
          }, 1000);
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
  padding: 20px;
  padding-bottom: 110px;

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
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
    }
    .line-item {
      margin-bottom: 20px;
      font-size: 14px;
      input {
        width: 100%;
        height: 60px;
        border-radius: 14px;
        border: 1px solid #cccccc;
        padding: 0 20px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }
  }
}
</style>
