<template>
  <div class="add-bank">
    <div class="edit-area">
      <div class="line-item">
        <input v-model="userInfo.aadhaarName" placeholder="Please enter your name" />
      </div>
      <div class="head">
        <span>IFSC Code</span>
        <span class="color-red" @click="showIfsc = true">Dont't remember your IFSC?</span>
      </div>

      <div class="line-item">
        <input v-model="editData.ifsc" placeholder="Please enter" />
      </div>
      <div class="line-item">
        <input v-model="editData.accountNumber" placeholder="Please enter your account number" />
      </div>
      <div class="line-item">
        <input v-model="editData.accountNumberConfirm" placeholder="Please confirm account number" />
      </div>
    </div>
    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
    </div>
    <ifsc-select v-if="showIfsc" @complete="completeIfsc" @close="showIfsc = false" />
  </div>
</template>

<script>
import ifscSelect from '@/components/ifsc-select.vue';
export default {
  components: {
    ifscSelect,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length >= 3;
      },
      deep: true,
    },
  },
  data() {
    return {
      showIfsc: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {
        ifsc: '',
      },
      saving: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    completeIfsc(data) {
      this.editData.ifsc = data.choosedIfsc;
      this.showIfsc = false;
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('bank_add_submit');
        if (this.editData.accountNumber != this.editData.accountNumberConfirm) {
          this.$toast('Account number is not consistent');
          return;
        }
        let saveData = { ...this.editData };
        saveData.name = this.userInfo.aadhaarName;
        delete saveData.accountNumberConfirm;

        if (saveData.ifsc.length != 11) {
          this.$toast('Please enter correct IFSC');
          return;
        }
        if (saveData.accountNumber.length < 7 || saveData.accountNumber.length > 22) {
          this.$toast('Please enter correct account number');
          return;
        }
        let data = await this.$http.post(`/wvpwoojady/bchcvyadogfdvghdayuo`, saveData);
        if (data.returnCode == 2000) {
          this.innerJump('complete-bank', this.$route.query, true);
        }
        this.eventTracker('bank_add_submit_success');
      } catch (error) {
        this.eventTracker('bank_add_submit_error');
        this.$toast(error.message);
        this.eventTracker('bank_add_submit_error');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-bank {
  padding: 30px 20px;
  padding-bottom: 110px;

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
      display: flex;
      justify-content: space-between;
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
