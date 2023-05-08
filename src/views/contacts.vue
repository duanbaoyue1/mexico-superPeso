<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="2"></complete-step>
    </div>

    <div class="edit-area-wrapper" v-for="(item, index) in familyContacts">
      <div class="edit-area-header">Emergency Contact {{ index + 1 }}</div>
      <div class="edit-area">
        <div class="line-item">
          <label>Family Member</label>
          <select-item :items="ALL_ATTRS.RELATION_SHIPS" title="Select Family Member" :itemAttrs="index" @choose="chooseRelation" />
        </div>

        <div class="line-item phone-select-wrapper" @click="choosePhone('familyPhone', index)">
          <label>Contact {{ index + 1 }} Phone No.</label>
          <div>
            <input id="familyPhone" v-model="item.mobile" disabled placeholder="Please select" />
            <m-icon class="icon" type="right" :width="8" :height="12" />
          </div>
        </div>
        <div class="line-item">
          <label>Contact {{ index + 1 }} Name</label>
          <input v-model="item.name" placeholder="Please enter" />
        </div>
      </div>
    </div>

    <div class="edit-area-wrapper" v-for="(item, index) in friendContacts">
      <div class="edit-area-header">Emergency Contact {{ index + 1 + familyContacts.length }}</div>
      <div class="edit-area">
        <div class="line-item phone-select-wrapper" @click="choosePhone('friendPhone', index)">
          <label>Contact {{ index + 1 + familyContacts.length }} Phone No.</label>
          <div>
            <input id="fiendPhone" v-model="item.mobile" disabled placeholder="Please select" />
            <m-icon class="icon" type="right" :width="8" :height="12" />
          </div>
        </div>
        <div class="line-item">
          <label>Contact {{ index + 1 + familyContacts.length }} Name</label>
          <input v-model="item.name" placeholder="Please enter" />
        </div>
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Submit</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        Congratulations!
        <br />
        Your personal information has been verified
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
      backCallback: () => {
        this.showMessageBox({
          content: 'Receive the money immediately after submitting the information. Do you really want to quit?',
          confirmBtnText: 'No',
          cancelBtnText: 'Leave',
          confirmCallback: () => {
            this.hideMessageBox();
          },
          cancelCallback: () => {
            this.hideMessageBox();
            this.goAppBack();
          },
          iconPath: 'handy/确定退出嘛',
        });
      },
    });
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = true;
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
      if (this.lastPhoneType) {
        if (this.lastPhoneType == 'familyPhone') {
          this.familyContacts[this.lastPhoneIndex].mobile = mobile;
          this.familyContacts[this.lastPhoneIndex].name = name;
        } else {
          this.friendContacts[this.lastPhoneIndex].mobile = mobile;
          this.friendContacts[this.lastPhoneIndex].name = name;
        }
      }
    };

    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: true, // 是否可以提交
      submitSuccess: false,
      friendContacts: [],
      familyContacts: [],
      lastPhoneType: '',
      lastPhoneIndex: 0,
      editData: {
      },
      saving: false,
    };
  },

  mounted() {
    // this.toAppMethod('needBackControl', { need: true });
    this.getAppContactsNum();
    this.eventTracker('contact_access');
  },

  methods: {
    async getAppContactsNum() {
      let familyContactsNum = 2,
        friendContactsNum = 2;
      try {
        let res = await this.$http.post(`/api/app/getAppContactsNum`);
        familyContactsNum = res.data.familyContactsNum;
        friendContactsNum = res.data.friendContactsNum;
      } catch (error) {
      } finally {
        this.familyContacts = Array.from({ length: familyContactsNum }, (v, k) => k).map(t => {
          return { relation: '', mobile: '', name: '' };
        });
        this.friendContacts = Array.from({ length: friendContactsNum }, (v, k) => k).map(t => {
          return { relation: 'Friends', mobile: '', name: '' };
        });
      }
    },
    chooseRelation(data) {
      this.familyContacts[data.attr].relation = data.value;
    },
    choosePhone(type, index) {
      this.lastPhoneType = type;
      this.lastPhoneIndex = index;
      this.toAppMethod('choosePhone', { type });
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('contact_submit');
        console.log(this.familyContacts, this.friendContacts);
        let saveData = { ...this.editData };
        let contacts = [...this.familyContacts, ...this.friendContacts];
        saveData.contacts = contacts;
        console.log(saveData);
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
  padding-bottom: 110px;
  min-height: 100%;
  background: #f6f6f6;
  padding-top: 0;
  box-sizing: border-box;
  .edit-area-header {
    font-size: 16px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: #333333;
    line-height: 24px;
    margin-bottom: 16px;
  }
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
