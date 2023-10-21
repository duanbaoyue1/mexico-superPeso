<template>
  <div class="complete-step">
    <div class="step" v-for="(step, index) in steps" :class="{ active: actionIndex > index, first: index == 0, last: index == steps.length - 1, cur: actionIndex == index }">
      <div class="stat-img-wrapper">
        <img class="stat-img" :src="actionIndex > index ? step.activeImg : step.noActiveImg" />
      </div>
      <div class="red-bot" :class="actionIndex >= index ? 'active' : ''"></div>
      <div class="text">{{ step.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['actionIndex'],
  data() {
    return {
      steps: [
        {
          text: '$2,000',
          activeImg: require('@/assets/img/superpeso/1金.png'),
          noActiveImg: require('@/assets/img/superpeso/1金.png'),
        },
        {
          text: '$4,000',
          activeImg: require('@/assets/img/superpeso/2金.png'),
          noActiveImg: require('@/assets/img/superpeso/灰2金.png'),
        },
        {
          text: '$6,000',
          activeImg: require('@/assets/img/superpeso/3金.png'),
          noActiveImg: require('@/assets/img/superpeso/灰3金.png'),
        },
        {
          text: '$8,000',
          activeImg: require('@/assets/img/superpeso/灰4金.png'),
          noActiveImg: require('@/assets/img/superpeso/灰4金.png'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.complete-step {
  display: flex;
  justify-content: center;
  width: 100%;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    position: relative;
    &::before {
      position: absolute;
      width: 86px;
      height: 2px;
      background: #e3e3e3;
      content: ' ';
      top: 33px;
      left: -43px;
      z-index: 0;
    }

    &:first-child {
      &::before {
        content: '';
        display: none;
      }
    }

    &.active {
      &::before {
        background: #40e2a0;
      }

      .red-bot {
        background: #40e2a0;
      }
    }

    &.first {
       .red-bot {
        background: #40e2a0;
      }
    }
    &.cur {
      &::before {
        background: #40e2a0;
      }
      .text {
        font-weight: bold;
        color: #333333;
      }
    }

    &.last {
      .red-bot {
        background: #cccccc !important;
      }
      // .text {
      //   color: #999999 !important;
      // }
    }

    .stat-img-wrapper {
      height: 30px;
      display: flex;
      align-items: center;
      img {
        width: 16px;
        display: block;
      }
    }

    .red-bot {
      margin-bottom: 13px;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #cccccc;
      z-index: 0;
      img {
        width: 10px;
        display: block;
      }
    }
    .text {
      color: #999999;
      font-weight: 500;
    }
    &.active {
      .text {
        font-weight: bold;
        color: #333333;
      }
    }
  }
}
</style>
