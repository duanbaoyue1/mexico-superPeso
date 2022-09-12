<template>
  <div class="define-table">
    <el-table size="small" border :data="data" style="width: 100%">
      <el-table-column prop="date" label="日期" width="95"> </el-table-column>
      <el-table-column prop="name" label="名称" width="95"> </el-table-column>
      <el-table-column prop="getTime" label="选出时间" width="95"> </el-table-column>
      <el-table-column label="最高涨幅" width="95">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="实时涨幅" width="95">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="流通市值" width="95">
        <template slot-scope="scope">
          <span>{{ (scope.row.freeMarket / 100000000).toFixed(2) }}亿</span>
        </template>
      </el-table-column>
      <el-table-column prop="yesterdayAmount" label="昨日交易" width="95"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
  },
};
</script>
<style lang="scss">
.define-table {
  .el-table thead {
    .cell {
      font-weight: 500;
      color: #333333;
    }
  }
  .el-table--small .el-table__cell {
    padding: 4px 6px;
    text-align: center;
  }
  .el-table .cell {
    font-size: 9px;
    font-size: 9px;
    color: #333333;
    line-height: 13px;
    padding: 0;
  }
}
</style>