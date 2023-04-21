<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="2"></complete-step>
    </div>

    <div class="edit-area">
      <div class="line-item">
        <label>Type of Accommodation</label>
        <select-item :items="ALL_ATTRS.ACCOMMODATION" title="Contacts Info" itemAttrs="houseType" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Number of Children</label>
        <select-item :items="ALL_ATTRS.CHILDREN" title="Number of Children" itemAttrs="childNum" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Pay Method</label>
        <select-item :items="ALL_ATTRS.PAY_METHOD" title="Pay Method" itemAttrs="incomeWay" @choose="chooseEditData" />
      </div>
    </div>

    <div class="edit-area">
      <div class="line-item">
        <label>Select Family Member</label>
        <select-item :items="ALL_ATTRS.RELATION_SHIPS" title="Select Family Member" itemAttrs="familyRelation" @choose="chooseEditData" />
      </div>

      <!-- <div class="line-item phone-select-wrapper" @click="choosePhone('familyPhone')"> -->
      <div class="line-item">
        <label>Phone No.</label>
        <div>
          <input id="familyPhone" v-model="editData.familyPhone" type="number" placeholder="Please enter" />
          <!-- <m-icon class="icon" type="right" :width="8" :height="12" /> -->
        </div>
      </div>
      <div class="line-item">
        <label>His or Her Name</label>
        <input v-model="editData.familyName" placeholder="Please enter" />
      </div>

      <!-- <div class="line-item phone-select-wrapper" @click="choosePhone('friendPhone')"> -->
      <div class="line-item">
        <label>Phone No.</label>
        <div>
          <input id="familyPhone" v-model="editData.friendPhone" type="number" placeholder="Please enter" />
          <!-- <m-icon class="icon" type="right" :width="8" :height="12" /> -->
        </div>
      </div>
      <div class="line-item">
        <label>friendName</label>
        <input v-model="editData.friendName" placeholder="Please enter" />
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Submit</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        Congratulations!
        <br />
        Your personal contacts has been verified
      </span>
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/select-item';
import * as ALL_ATTRS from '@/config/typeConfig';
import CompleteStep from '@/components/complete-step.vue';

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
      title: 'Complete information',
      backCallback: null,
    });
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length > 1 && !this.saving;
      },
      deep: true,
    },
  },
  data() {
    window.choosePhoneCallback = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      let { type, phone, name } = data;
      if (type) {
        this.$set(this.editData, type, phone);
        if (type == 'familyPhone' && name) {
          this.$set(this.editData, 'familyName', name);
        }
        if (type == 'friendPhone' && name) {
          this.$set(this.editData, 'friendName', name);
        }
      }
    };

    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {
        friendName: '',
        friendPhone: '',
        familyName: '',
        familyPhone: '',
      },
      saving: false,
    };
  },

  mounted() {
    this.eventTracker('contact_access');
    this.initInfoBackControl();
  },

  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
    },
    choosePhone(type) {
      this.toAppMethod('choosePhone', { type });
    },

    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('contact_submit');
        let saveData = { ...this.editData };
        let contacts = [];
        if (saveData.familyRelation) {
          contacts.push({
            name: saveData.familyName,
            relation: saveData.familyRelation,
            mobile: saveData.familyPhone,
          });
        }
        contacts.push({
          name: saveData.friendName,
          relation: 'Friends',
          mobile: saveData.friendPhone,
        });
        saveData.contacts = contacts;
        // TODO 这里bug报错 没有联系人信息
        let data = await this.$http.post(`/api/user/addInfo/save`, saveData);
        if (data.returnCode === 2000) {
          this.submitSuccess = true;
          this.eventTracker('contact_submit_success');
          setTimeout(() => {
            this.submitSuccess = false;
            this.innerJump('complete-bank', { orderId: this.$route.query.orderId, from: 'order' }, true);
          }, 2000);
        }
      } catch (error) {
        this.eventTracker('contact_submit_error');
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
  padding: 20px 24px;
  padding-bottom: 94px;
  overflow-y: auto;
  background: #f6f6f6;
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
    z-index: 2;
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
    background: #f6f6f6;
  }
  .step {
    padding-top: 10px;
    margin-bottom: 32px;
  }

  .edit-area {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    margin-bottom: 16px;

    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
    }

    .line-item {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e3e3e3;
      height: 52px;
      &:last-child {
        border-bottom: none;
      }
      label {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        flex-shrink: 0;
        margin-right: 10px;
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        text-align: right;
        padding: 0 0px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }

    .phone-select-wrapper {
      > div {
        display: flex;
        align-items: center;
        input {
          background: transparent;
        }
        img {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
