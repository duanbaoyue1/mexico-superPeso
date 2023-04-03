<template>
  <div class="help-center">
    <div class="hour-email">
      <div>
        <div class="head">Working Hours</div>
        <div class="item">Monday to Friday (9am - 7pm)</div>
      </div>
      <div>
        <div class="head">E-mail</div>
        <div class="item">{{ feedEmail }}</div>
      </div>
    </div>

    <div class="questions">
      <div v-for="(item, index) in questions" :key="item.desc" class="item" @click="showAnswer(index)">
        <div class="desc">
          <span>{{ item.desc }}</span>
          <m-icon class="icon" :class="{ open: item.showAnswer }" type="right" :width="8" :height="12" />
        </div>
        <div class="answer" v-show="item.showAnswer">{{ item.answer }}</div>
      </div>
    </div>

    <!-- <div class="actions">
      <a @click="goComplain">I have a problem to complain</a>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: 'EasyMoneyCS01@outlook.com',
      questions: [
        {
          desc: 'Why was my loan application rejected?',
          answer: "The results of the review are displayed in the lender's system to allow a full assessment of your eligibility. The review was rejected because your eligibility did not meet the requirements. You can try applying for other loan products to meet your financial needs.",
        },
        {
          desc: 'How long does it take to get the result of the review once you have applied for a loan?',
          answer: 'Once the application has been completed, it is sent to the lender immediately. The review period varies for each product. Please be patient and wait.',
        },
        {
          desc: 'How do I repay the loan?',
          answer: 'You can apply for repayment according to the repayment order.',
        },
        {
          desc: 'How long does it take to get a loan after approval?',
          answer: 'Please be patient as the bank will transfer the money to your account once the verification process is completed.',
        },
        {
          desc: 'Will my personal information be disclosed?',
          answer: "To protect all users' personal information and to ensure that it is not disclosed to others, we have included a confidentiality agreement in the app.",
        },
        {
          desc: 'What is the penalty for overpayment if I make a late payment?',
          answer: 'Each product has a different policy for overdue payments and there is a corresponding penalty rate depending on the product',
        },
        {
          desc: 'What are the penalties for overpayment if I make a late payment?',
          answer: 'Each product has a different late payment policy and a corresponding penalty rate, depending on the product in question.',
        },
      ],
    };
  },
  mounted() {
    setTimeout(async () => {
      try {
        let user = await this.getUserInfo();
        if (parseInt(user.id) % 2 == 1) {
          this.feedEmail = 'EasyMoneyCS03@outlook.com';
        }
      } catch (error) {}
    }, 200);
  },

  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, { ...this.questions[index], showAnswer: !this.questions[index].showAnswer });
    },
    goComplain() {
      this.innerJump('complain-home');
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center {
  // background: #f4f4f4;
  padding-bottom: 80px;

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
    a {
      font-size: 14px;
      font-weight: 500;
      color: #1143a4;
      line-height: 18px;
      text-decoration: underline;
    }
  }

  .questions {
    background: #fff;
    padding: 16px 24px;
    .item {
      width: 320px;
      border-radius: 14px;
      box-sizing: border-box;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      .desc {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        color: #000000;

        .icon {
          transition: all 0.3s;
          margin-top: 6px;
          &.open {
            transform: rotate(90deg);
          }
        }
      }
      .answer {
        padding-top: 10px;
      }
    }
  }

  .hour-email {
    background: #fff;
    padding: 16px;
    margin: 24px;
    border-radius: 8px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .head {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      flex-shrink: 0;
    }

    .item {
      flex-grow: 1;
      margin-left: 20px;
      height: 20px;
      box-sizing: border-box;
      border: none;
      font-size: 12px;
      font-weight: 900;
      width: 100%;
      color: #000000;
      text-align: right;
      line-height: 20px;
    }
  }
}
</style>
