<template>
  <div class="tips">
    <div class="header">风险提示</div>
    <p>财联社·舞阳免责声明：本平台所提供信息仅供一般参考，不代表本平台推荐或提供任何投资建议。</p>
    <!-- <p>投资有风险。本产品所有集合股票收益走势，均不代表真实收益或对未来收益之预期，计算未纳入印花税、交易费用、分红等因素的计算：所荐个股盈亏仅作统计参考之用，不建议投资者逐一操作，或作为直接投资之依据。</p> -->
    <p>投资者须注意，投资的价值及其所得收益均可升可跌，甚至变得毫无价值。任何投资产品的过往表现并非未来表现的可靠指标，不应依赖任何预测、预期及模拟作为未来结果的指标。投资者应基于投资经验、投资目标、财务来源等仔细考量每一项投资的适合度，自行作出投资决定。</p>
  </div>
</template>

<style lang="scss" scoped>
.tips {
  margin-top: 50px;
  font-size: 13px;
  color: #bbbcbe;
  line-height: 17px;
  .header {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    line-height: 19px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 20px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
}
</style>
