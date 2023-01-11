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
        <input disabled value="okcash@gmail.com" />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [
        {
          desc: 'Why choose DreamCash?',
          answer: 'DreamCash is safe, simple and fast personal loan platform in India. Before received your salary, if you want to buy any electronic products or something else in urgent need, you can apply a short-term personal loan from DreamCash.',
        },
        {
          desc: 'Why choose DreamCash?',
          answer: 'DreamCash is safe, simple and fast personal loan platform in India. Before received your salary, if you want to buy any electronic products or something else in urgent need, you can apply a short-term personal loan from DreamCash.',
        },
        {
          desc: 'Why choose DreamCash?',
          answer: 'DreamCash is safe, simple and fast personal loan platform in India. Before received your salary, if you want to buy any electronic products or something else in urgent need, you can apply a short-term personal loan from DreamCash.',
        },
      ],
    };
  },
  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, { ...this.questions[index], showAnswer: !this.questions[index].showAnswer });
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center {
  background: #f4f4f4;

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
