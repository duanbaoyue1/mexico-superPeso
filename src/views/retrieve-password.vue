<template>
  <div class="password">
    <div class="edit-area">
      <div class="line-item">
        <input v-model="userInfo.mobile" disabled />
      </div>
      <div class="line-item">
        <input v-model="editData.oldPassword" placeholder="Enter the original password" />
      </div>
      <div class="line-item">
        <input v-model="editData.newPassword" placeholder="Set new password" :type="passwordType" />
        <m-icon class="eye" :type="passwordType != 'text' ? 'password/eye-hide' : 'password/eye-show'" :width="32" :height="20" @click="togglePassword('passwordType')" />
      </div>
      <div class="line-item">
        <input v-model="editData.enterPassword" placeholder="Set new password" :type="passwordAgainType" />
        <m-icon class="eye" :type="passwordAgainType != 'text' ? 'password/eye-hide' : 'password/eye-show'" :width="32" :height="20" @click="togglePassword('passwordAgainType')" />
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
import md5 from 'js-md5';
export default {
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).filter(t => !!t).length === 3;
      },
      deep: true,
    },
  },
  data() {
    return {
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      passwordType: 'text',
      passwordAgainType: 'text',
      editData: {
        phoneNumber: '',
        oldPassword: '',
        newPassword: '',
        enterPassword: '',
      },
    };
  },

  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    togglePassword(field) {
      this.$set(this, field, this[field] === 'password' ? 'text' : 'password');
    },
    async submit() {
      if (this.editData.newPassword !== this.editData.enterPassword) {
        this.$toast('The two passwords are inconsistent');
        return;
      }

      try {
        let data = await this.$http.post(`/clyb/qjhwfxzblwjjii`, {
          phoneNumber: this.userInfo.mobile,
          oldPassword: md5(this.editData.oldPassword),
          newPassword: md5(this.editData.newPassword),
          enterPassword: md5(this.editData.enterPassword),
        });
        this.toAppMethod('refreshtoken', data.data);
      } catch (error) {
        this.$toast(error.message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.password {
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 110px;

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    display: none;
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
  .edit-area {
    .line-item {
      margin-bottom: 20px;
      font-size: 14px;
      position: relative;
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
      .eye {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
