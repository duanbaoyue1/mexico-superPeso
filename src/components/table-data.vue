<template>
  <div class="define-table">
    <el-table size="small" border :data="data" style="width: 100%">
      <el-table-column label="日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.date.replace(/-/g, '') }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="239"> </el-table-column>
      <el-table-column prop="getTime" label="选出时间" width="150"> </el-table-column>
      <el-table-column label="最高收益" width="150">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="实时收益" width="150">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="流通市值" width="150">
        <template slot-scope="scope">
          <span>{{ (scope.row.freeMarket / 100000000).toFixed(2) }}亿</span>
        </template>
      </el-table-column>
      <el-table-column label="昨日交易" width="150">
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
  background: transparent;
  .el-table {
    background: transparent;
    border-color: #dddddd;
    tr {
      background: transparent;
      font-size: 13px;
      color: #ffffff;
      line-height: 17px;
    }
    thead {
      .cell {
        .cell {
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }

  .el-table--small .el-table__cell {
    padding: 2px 0px;
    text-align: center;
  }
  .el-table .cell {
    font-size: 9px;
    font-size: 9px;
    line-height: 13px;
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 9px !important;
    padding-bottom: 9px !important;
  }
  .el-table th.el-table__cell {
    background-color: transparent;
  }
  .el-table th.el-table__cell > .cell {
    font-size: 13px;
    font-weight: bold;
    color: #ffffff;
    line-height: 17px;
  }
  .el-table td.el-table__cell {
    border-bottom: 1px solid #ddd;
  }
  .el-table--border .el-table__cell {
    border-right: 1px solid #ddd;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
    background: transparent;
  }
}
</style>
