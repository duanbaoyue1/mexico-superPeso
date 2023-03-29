<template>
  <div>
    <div class="no-data" v-if="!lists.length">
      <img :src="require('@/assets/img/complain/No Order@2x.png')" />
      No record
    </div>
    <div class="complains" v-else>
      <div class="complains-item" v-for="item in lists" :key="item.id">
        <div class="head">
          <span>No.1387547894</span>
          <span>2022/11/10</span>
        </div>
        <div class="content">
          <div class="flex-between">
            <span>Feedback agency</span>
            <span>RBI</span>
          </div>
          <div class="flex-between">
            <span>Type of question</span>
            <span>Reminder of repayment problems</span>
          </div>
          <div class="questions">
            <div>Question Details</div>
            <div class="question">I have some questions to give feedback, please give me the answer as soon as you receive the message.</div>
          </div>
          <div class="imgs" v-if="item.imgs">
            <div class="img" v-for="(img, index) in item.imgs" :key="img" :style="{ backgroundImage: 'url(' + img + ')' }"></div>
          </div>
        </div>
        <div class="status">Your complaint is being sent to RBI, please be patient</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [
        {
          id: 1,
        },
        { id: 2 },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.no-data {
  padding-top: 100px;
  font-size: 16px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  text-align: center;
  img {
    display: block;
    width: 120px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}

.complains {
  &-item {
    padding: 30px 20px;

    border-bottom: 6px solid #f4f4f4;
    &:last-child {
      border-bottom: none;
      margin-bottom: 20px;
    }

    .head {
      display: flex;
      margin-bottom: 10px;
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      justify-content: space-between;
    }
    .content {
      border-radius: 14px;
      border: 1px solid #cccccc;
      padding: 20px;
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 18px;

      .flex-between {
        align-items: flex-start;
        margin-bottom: 10px;
        span {
          &:first-child {
            white-space: nowrap;
          }
          &:nth-child(2) {
            margin-left: 30px;
          }
        }
      }
      .questions {
        .question {
          margin-top: 10px;
        }
      }

      .imgs {
        margin-top: 10px;
        display: flex;
        > * {
          margin-right: 10px;
        }
        .img {
          width: 74px;
          height: 74px;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          background-size: cover;
          background-position: center;
        }
      }
    }

    .status {
      background: #fff9ec;
      border-radius: 4px;
      font-size: 12px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #ffbc41;
      line-height: 18px;
      padding: 10px;
      margin-top: 20px;
      &.success {
        color: #04ca1c;
        background: #e5fae8;
      }
    }
  }
}
</style>
