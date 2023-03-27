<template>
  <div class="complete-bank">
    <template v-if="from == 'order'">
      <div class="step">
        <m-icon class="icon" type="information/step4" :width="98" :height="28" />
        <span>(&nbsp;A total of 4 steps are required&nbsp;)</span>
      </div>
      <div class="head-top">Payment method</div>
    </template>

    <div class="cards">
      <div v-if="cards.length" class="cards-list">
        <div v-for="card in cards" class="cards-item" :key="card.id" @click="chooseBank(card)">
          <div class="card-name">
            <m-icon class="bank" type="bank/bank" :width="30" :height="30" />
            <span>{{ card.bank }} ({{ card.accountNumber }})</span>
          </div>
          <m-icon class="choose" :type="choosedBankId == card.id ? 'bank/choosed' : 'bank/not-choosed'" :width="18" :height="18" />
          <div class="bottom"></div>
        </div>
      </div>
      <div v-else>
        <m-icon class="none" type="bank/none" :width="78" :height="60" />
      </div>
      <div class="add-card" @click="goAddCard">
        <m-icon class="icon" type="add" :width="14" :height="14" />
        Add New Accounts
      </div>
    </div>

    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
    </div>
  </div>
</template>

<script>
import * as ALL_ATTRS from '@/config/typeConfig';

export default {
  watch: {
    choosedBankId: {
      handler() {
        this.canSubmit = !!this.choosedBankId;
      },
      deep: true,
    },
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      cards: [],
      from: this.$route.query.from,
      choosedBankId: '',
      saving: false,
      editData: {
        friendName: '',
        friendPhone: '',
        familyName: '',
        familyPhone: '',
      },
    };
  },

  mounted() {
    this.getBanks();

    // 银行卡选择后app抓取数据回调
    window.synDataCallback = async data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('bank_submit_sync_success');
        if (!this.saving) {
          this.saving = true;
          try {
            await this.$http.post(`/zihai/ngqqhvwioeludlcdnrput`, {
              orderId: this.$route.query.orderId,
              remittanceAccountId: this.choosedBankId,
            });
            this.eventTracker('bank_submit_success');
            let appMode = await this.getAppMode();
            if (appMode.confirmType == 1) {
              // 需要进确认申请页
              this.innerJump('loan-confirm', {
                orderId: this.$route.query.orderId,
              });
            } else {
              // 不需要进确认申请页
              this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: new Date().getTime() });
            }
          } catch (error) {
            this.eventTracker('bank_submit_error');
            this.showMessageBox({
              content: error.message,
              confirmBtnText: 'Ok',
              confirmCallback: () => {
                this.hideMessageBox();
              },
              iconPath: 'message/error',
              showClose: false,
            });
          } finally {
            this.saving = false;
          }
        }
      }
    };
  },

  methods: {
    goAddCard() {
      this.eventTracker('bank_add');
      this.innerJump('add-bank', this.$route.query, true);
    },
    async getBanks() {
      let data1 = await this.$http.post('/wvpwoojady/wvpwoojadyydddcuezgltu');
      let data2 = await this.$http.post('/wvpwoojady/wvpwoojadyydddcuezgltj');
      this.cards = this.mergeTwoArray(data1.data.list, data2.data.list);
      this.choosedBankId = this.cards[0].id;
    },
    chooseBank(bank) {
      this.choosedBankId = bank.id;
    },
    async submit() {
      this.eventTracker('bank_submit');
      try {
        if (this.$route.query.from == 'order') {
          // 从订单进来的, 需要先通知app方法
          this.toAppMethod('synData', {});
        } else {
          this.showLoading();
          // 从个人中心进来，则是修改默认卡
          await this.$http.post(`/wvpwoojady/qjhwfxozwqjwii`, {
            remittanceAccountId: this.choosedBankId,
          });
          this.hideLoading();
          this.goAppBack();
        }
      } catch (error) {
        this.showMessageBox({
          content: error.message,
          confirmBtnText: 'Ok',
          confirmCallback: () => {
            console.log('confirmCallback');
            this.hideMessageBox();
          },
          iconPath: 'message/error',
          showClose: false,
        });
      } finally {
        this.hideLoading();
      }

      // this.showMessageBox({
      //   content: 'The name of the bank account you submitted is inconsistent with your name, please change it to your own account.',
      //   confirmBtnText: 'Submit',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/edit',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: 'Bank account verification failed, please change another bank account',
      //   confirmBtnText: 'Ok',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/error',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: 'Receive the money immediately after submitting the information. Do you really want to quit?',
      //   confirmBtnText: 'Yes',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/question',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: '<div><p style="color: #FF380C;font-weight: 500;margin-bottom: 20px;text-align: center">UTR has not been received</p>The order : 220624325998661663 hasn’t been repaid.</div>',
      //   confirmBtnText: 'Repay',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   cancelBtnText: 'Enter UTR',
      //   cancelCallback: () => {
      //     console.log('cancelCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/error',
      //   showClose: true,
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 20px;
  padding-bottom: 110px;

  .cards {
    .none {
      margin: 80px auto 40px;
    }
    .add-card {
      width: 240px;
      height: 40px;
      background: #fd973f;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
      display: flex;
      align-items: center;
      margin: 0 auto;
      padding: 0 28px;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .cards-list {
      padding-top: 20px;
      padding-bottom: 40px;
    }

    &-item {
      height: 70px;
      box-sizing: border-box;
      background: #e3eafd;
      border-radius: 14px 14px 0px 0px;
      border-bottom: 2px solid #333333;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      margin-bottom: 20px;
      line-height: 18px;
      justify-content: space-between;
      position: relative;
      width: 300px;
      margin-left: 10px;
      .bank {
        margin-right: 10px;
      }
      .card-name {
        display: flex;
        align-items: center;
      }
      .bottom {
        position: absolute;
        width: 320px;
        height: 6px;
        border: 2px solid #000000;
        bottom: -6px;
        left: -10px;
        border-radius: 10px;
        z-index: -1;
      }
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

  .head-top {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 26px;
    margin-bottom: 10px;
  }
}
</style>
