<template>
  <div class="help-center">
    <div class="hour-email">
      <div class="head">
        <m-icon class="icon" type="help/Working Hours" width="20" height="20" />
        Working Hours :
      </div>
      <div class="item">
        <input disabled value="Monday to Friday (9am - 7pm)" />
      </div>
      <div class="head">
        <m-icon class="icon" type="help/E-mail" width="20" height="20" />
        E-mail :
      </div>
      <div class="item">
        <input disabled value="EasyMoneyCS01@outlook.com" />
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

    <div class="actions">
      <a @click="goComplain">I have a problem to complain</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    padding: 20px;
    .item {
      width: 320px;
      border-radius: 14px;
      border: 1px solid #cccccc;
      box-sizing: border-box;
      padding: 20px;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      .desc {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .icon {
          transition: all 0.3s;
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
    padding: 20px;
    margin-bottom: 6px;
    padding-top: 10px;

    .head {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      margin-top: 20px;
      margin-bottom: 10px;
      line-height: 18px;
      .icon {
        margin-right: 10px;
      }
    }

    .item {
      input {
        width: 320px;
        height: 60px;
        border-radius: 14px;
        border: 1px solid #cccccc;
        padding: 0 20px;
        box-sizing: border-box;
        background: #fff;
        display: block;
      }
    }
  }
}
</style>
