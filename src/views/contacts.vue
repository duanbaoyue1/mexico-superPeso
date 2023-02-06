<template>
  <div class="information">
    <div class="padding20 border4">
      <div class="step">
        <m-icon class="icon" type="information/step3" :width="98" :height="28" />
        <span>(&nbsp;A total of 4 steps are required&nbsp;)</span>
      </div>
      <div class="edit-area">
        <div class="head-top">Contacts Info</div>
        <div class="head">Type of Accommodation</div>
        <div class="line-item">
          <select-item :items="ALL_ATTRS.ACCOMMODATION" itemAttrs="houseType" @choose="chooseEditData" />
        </div>
        <div class="head">Number of Children</div>
        <div class="line-item">
          <select-item :items="ALL_ATTRS.CHILDREN" itemAttrs="childNum" @choose="chooseEditData" />
        </div>
        <div class="head">Pay Method</div>
        <div class="line-item">
          <select-item :items="ALL_ATTRS.PAY_METHOD" itemAttrs="incomeWay" @choose="chooseEditData" />
        </div>
      </div>
    </div>

    <div class="edit-area padding20 border4">
      <div class="head">Select Family Member</div>
      <div class="line-item">
        <select-item :items="ALL_ATTRS.RELATION_SHIPS" itemAttrs="familyRelation" @choose="chooseEditData" />
      </div>

      <div class="head">Phone No.</div>
      <div class="line-item phone-select-wrapper" @click="choosePhone('familyPhone')">
        <input id="familyPhone" v-model="editData.familyPhone" disabled type="number" placeholder="Please select" />
        <m-icon class="icon" type="right" :width="8" :height="12" />
      </div>
      <div class="line-item">
        <input id="familyName" v-model="editData.familyName" placeholder="Please enter Name1" />
      </div>
    </div>

    <div class="edit-area padding20">
      <div class="head">Friends No.</div>
      <div class="line-item phone-select-wrapper" @click="choosePhone('friendPhone')">
        <input id="friendPhone" v-model="editData.friendPhone" disabled type="number" placeholder="Please select" />
        <m-icon class="icon" type="right" :width="8" :height="12" />
      </div>
      <div class="line-item">
        <input id="friendName" v-model="editData.friendName" placeholder="Please enter friend’s name" />
      </div>
    </div>
    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
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

export default {
  components: {
    selectItem,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length > 1;
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
    };
  },

  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
    },
    choosePhone(type) {
      this.toAppMethod('choosePhone', { type });
    },
    async submit() {
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

      try {
        let data = await this.$http.post(`/clyb/bchpufd/ewca`, saveData);
        console.log(data);
        if (data.returnCode === 2000) {
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
            this.innerJump('complete-bank', { orderId: this.$route.query.orderId, from: 'order' }, true);
          }, 2000);
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
  padding-bottom: 110px;

  .padding20 {
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .border4 {
    border-bottom: 4px solid #f4f4f4;
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
        background: #fff;
      }
      &.phone-select-wrapper {
        position: relative;
        .icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
