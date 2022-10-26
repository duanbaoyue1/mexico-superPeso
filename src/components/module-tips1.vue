<template>
  <div class="module-tips">
    <div class="module">
      <!-- <header>策略原理讲解及详细介绍</header>
      <p>一只标的不会无缘无故拉升，底部启动往往酝酿一波主升浪行情。但一味地冒进很容易适得其反！如果在缩量回调的时候低吸介入，可做到进可攻退可守。</p>
      <img class="pick" :src="require('@/assets/img/web/pick1@2x.png')" />
      <div class="attrs">
        <div>
          <p class="em">热点板块</p>
          <p class="color-333 block">本策略选出来的标的主要集中在中小盘，也是游资最集中的流通盘范围，一旦炒作一个板块，涨得最多的就是小盘股，所以在策略中算法跟随小盘热点。</p>
        </div>
        <div>
          <p class="em">涨停基因</p>
          <p class="color-333 block">曾经被市场炒作过的标的往往众所周知，所以一旦该标的重启，就会很快被市场关注，主力只需要点火即可，后续市场大量资金会来合力推升。</p>
        </div>
        <div>
          <p class="em">技术面好</p>
          <p class="color-333 block">主要计算大单金额和大单净量数据，大单净量代表大单金额占流通市值的百分比，强势涨停当天大单净量越大代表主力越坚决，控盘度越高。</p>
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
        <p><span>流通市值：</span><span class="color-666">可交易的流通股价值。</span></p>
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
