<template>
  <div class="define-table">
    <el-table size="small" border :data="data" style="width: 100%">
      <el-table-column v-if="!showData" label="日期" width="65">
        <template slot-scope="scope">
          {{ scope.row.date.replace(/-/g, '') }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="70"> </el-table-column>
      <el-table-column prop="getTime" label="选出时间" width="60"> </el-table-column>
      <el-table-column label="最高收益" width="65">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="实时收益" width="65">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="流通市值" width="70">
        <template slot-scope="scope">
          <span>{{ (scope.row.freeMarket / 100000000).toFixed(2) }}亿</span>
        </template>
      </el-table-column>
      <el-table-column label="昨日交易" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.yesterdayAmount }}亿</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    showData: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    }
  }
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
    padding: 2px 0px;
    text-align: center;
  }
  .el-table .cell {
    font-size: 9px;
    font-size: 9px;
    color: #333333;
    line-height: 13px;
    padding: 0;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
