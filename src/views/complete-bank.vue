<template>
  <div class="complete-bank content-area">
    <div class="cards">
      <div class="cards-list">
        <div v-for="card in cards" class="cards-item" :class="{ active: chooseBankId == card.id }" :key="card.id" @click="chooseBank(card)">
          <div class="card-name">
            <m-icon :class="{ active: chooseBankId == card.id }" :type="computedType(card)" :width="32" :height="32" />
            <div>
              <div class="name">{{ card.bank }}（{{ card.accountNumber | phoneHideFilter }}）</div>
            </div>
          </div>
          <m-icon class="choose" :class="{ active: chooseBankId == card.id }" :type="chooseBankId == card.id ? 'superpeso/选中 (1)备份' : 'superpeso/未选择'" :width="20" :height="20" />
          <!-- <span class="default-tips" v-if="chooseBankId == card.id">Tarjeta bancaria por defecto</span> -->
        </div>
      </div>
      <div class="add-card" @click="goAddCard">
        <m-icon class="icon" type="superpeso/添加" :width="16" :height="16" />
        Agregar un nuevo método
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>
  </div>
</template>

<script>
import * as ALL_ATTRS from '@/config/typeConfig';
import CompleteStep from '@/components/complete-step.vue';

export default {
  components: {
    CompleteStep,
  },
  computed: {
    computedType() {
      return card => {
        if (this.chooseBankId == card.id) {
          return card.type == 0 ? 'superpeso/银行卡点亮' : 'superpeso/Clabe点亮';
        } else {
          return card.type == 0 ? 'superpeso/银行卡未点亮' : 'superpeso/Clabe灰';
        }
      };
    },
  },
  watch: {
    chooseBankId: {
      handler() {
        this.canSubmit = !!this.chooseBankId;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Tarjeta bancaria',
      backCallback: null,
    });
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      cards: [],
      from: this.$route.query.from,
      orderId: this.$route.query.orderId,
      chooseBankId: '',
      saving: false,
      curChooseBank: '',
      editData: {
        friendName: '',
        friendPhone: '',
        familyName: '',
        familyPhone: '',
      },
    };
  },

  mounted() {
    document.body.style.backgroundColor = '#fff';
    this.getBanks();
    if (this.from != 'mine') {
      this.eventTracker('bank_access');
    }
  },

  methods: {
    goAddCard() {
      this.eventTracker('bank_add');
      this.innerJump('add-bank', { orderId: this.orderId });
    },
    async getBanks() {
      let data = await this.$http.post('/api/remittance/remittanceAccountList');
      this.cards = data.data.list || [];
      let chooseBank = this.cards.filter(t => t.markLoanCard == 1);
      if (chooseBank.length) {
        this.chooseBankId = chooseBank[0].id;
        this.curChooseBank = chooseBank[0];
      } else if (this.cards.length > 0) {
        this.chooseBankId = this.cards[0].id;
        this.curChooseBank = this.cards[0];
      }
    },

    async chooseBank(bank) {
      this.curChooseBank = bank;
      this.chooseBankId = bank.id;
    },

    async submit() {
      this.showLoading();
      this.eventTracker('bank_submit');
      try {
        if (this.from == 'order') {
          // 绑卡
          await this.$http.post(`/api/order/bindRemittanceAccount`, { remittanceAccountId: this.chooseBankId, orderId: this.orderId });
          // 判断是否需要确认订单
          let appMode = await this.getAppMode();
          if (appMode.confirmType == 1) {
            // 需要进确认申请页
            this.innerJump('loan-confirm', { orderId: this.orderId }, true);
          } else {
            // 不需要进确认申请页
            this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: this.getLocalSystemTimeStamp() }, true);
          }
        } else {
          // 从个人中心进来，则是修改默认卡
          await this.$http.post(`/api/remittance/modifyLoanCard`, {
            accountNumber: this.curChooseBank.accountNumber,
            bank: this.curChooseBank.bank,
            name: this.curChooseBank.name,
            type: this.curChooseBank.type,
          });
          this.hideLoading();
          this.eventTracker('bank_submit_success');
          this.$toast('Vinculación de la tarjeta bancaria con éxito');
          setTimeout(res => {
            this.innerJump('mine');
          }, 1000);
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 24px 16px;
  background: #fff;
  box-sizing: border-box;

  .cards {
    background: #fff;
    margin-top: 24px;
    .none {
      margin: 44px auto 40px;
    }
    .add-card {
      width: 279px;
      height: 48px;
      font-size: 16px;
      line-height: 22px;
      display: flex;
      align-items: center;
      margin: 0 auto;
      padding: 0 28px;
      justify-content: space-between;
      box-sizing: border-box;
      background: #43e0a2;
      border-radius: 8px;
      white-space: nowrap;
      font-weight: bold;
      color: #333333;
      img {
        margin-right: 16px;
      }
    }
    .cards-list {
      padding-bottom: 48px;
    }

    &-item {
      height: 52px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      margin-bottom: 20px;
      line-height: 18px;
      justify-content: space-between;
      position: relative;
      background-size: cover;
      border: 1px solid #cccccc;
      border-radius: 8px;
      margin-bottom: 16px;

      &.active {
        border: 2px solid #333333;
        background: #43e0a2;
        .card-name {

          .name {
            color: #3b3735;
          }
        }
      }

      .choose {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 16px;
        &.active {
          background: #fff;
          border-radius: 100%;
        }
      }
      .default-tips {
        font-size: 10px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
        line-height: 1;
        background: #ffdc62;
        border-radius: 100px 0px 0px 100px;
        position: absolute;
        padding: 7px 8px;
        bottom: 8px;
        right: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .bank {
        margin-right: 10px;
      }
      .card-name {
        display: flex;
        align-items: center;
        img {
          margin-right: 8px;
        }
        > div {
          .name {
            font-size: 16px;
            font-weight: 500;
            line-height: 1;
            padding-right: 20px;
          }
        }
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
