<template>
  <div class="module-tips">
    <div class="module">
      <!-- <header>策略原理讲解及详细介绍</header>
      <p>在市场恐慌情绪泛滥的情况下，众多交易者会不计成本割掉手中的筹码，如果此时主力空翻多大单接盘，就是一种情绪反转的征兆。后续市场冷静后，该标的往往会提前表现，走出一波行情。</p>
      <img class="pick" :src="require('@/assets/img/web/pick1@2x.png')" />
      <div class="attrs">
        <div>
          <p class="em">大跌后反转</p>
          <p class="color-333 block">因市场行情太差带动个股一起下跌，或者因个股突发短期影响利空，就会导致股价持续走低。在跌幅过大或者关键性支撑位时，主力就开始出手控制下跌趋势。此时就可以和主力一起慢慢吸筹，反转后再立即加仓。</p>
        </div>
        <div>
          <p class="em">大涨后回调</p>
          <p class="color-333 block">昨日大涨甚至涨停，次日回调后，仍存在资金介入，AI算法计算大涨后回调时机。</p>
        </div>
        <div>
          <p class="em">技术面好</p>
          <p class="color-333 block">标的股价活性强的，最好是白马蓝筹股。屏蔽小盘股可以规避主力通过对倒制造大资金流入的假象。</p>
        </div>
        <div>
          <p class="em">基本面</p>
          <p class="color-333 block">结合公司的市值、PE、股东数近期增减、增长预期等综合分析，市值和交易额太小则基本面较差，估值过高就要考虑安全边际，股东数增减代表近期主力动作。</p>
        </div>
      </div> -->

      <img class="pick" :src="require('@/assets/img/web/pick2@2x.png')" />
      <div class="add-attrs">
        <p><span>选出时间：</span><span class="color-666">系统策略实时选出标的精准时间。</span></p>
        <p><span>最高涨幅：</span><span class="color-666">标的选出后，曾经最高的涨幅。</span></p>
        <p><span>至今涨幅：</span><span class="color-666">标的选出后，最新股价的涨幅。</span></p>
        <p><span>流通市值：</span><span class="color-666">流通股本x最新股价。</span></p>
        <p><span>昨日交易：</span><span class="color-666">昨日交易资金量。</span></p>
      </div>

      <risk-tips></risk-tips>
    </div>
  </div>
</template>

<script>
import RiskTips from '@/components/risk-tips.vue';

export default {
  components: {
    RiskTips,
  },
};
</script>

<style lang="scss" scoped>
.module-tips {
  .module {
    box-sizing: border-box;
    color: #fff;
    header {
      text-align: center;
      font-size: 26px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #ffd1b6;
      line-height: 35px;
      padding-bottom: 10px;
      position: relative;
      margin-bottom: 20px;
      &::after {
        position: absolute;
        content: ' ';
        bottom: 0px;
        width: 100px;
        height: 4px;
        background: #ffd1b6;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 17px;
      margin-bottom: 0;
      margin-top: 0;
    }
    .pick {
      height: 34px;
      margin-top: 30px;
      margin-bottom: 20px;
    }
    .attrs {
      display: flex;
      margin-right: -10px;
      > div {
        width: 260px;
        background: #1d2028;
        border-radius: 100px 5px 5px 5px;
        padding: 10px;
        font-size: 14px;
        color: #bbbcbe;
        line-height: 24px;
        margin-right: 10px;

        .em {
          font-size: 15px;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
          margin-bottom: 6px;
        }
        .block {
          text-indent: 20px;
          margin-bottom: 10px;
        }
      }
    }

    .add-attrs {
      p {
        font-size: 15px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        line-height: 20px;
        margin-bottom: 20px;
        color: #bbbcbe;
        span {
          &:first-child {
            color: #eb333b;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
