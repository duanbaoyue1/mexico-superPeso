<template>
  <div class="define-table">
    <el-table size="small" border :data="data" style="width: 100%" v-if="data.length > 0">
      <el-table-column prop="name" label="个股名称" width="239"> </el-table-column>
      <el-table-column prop="code" label="个股代码" width="150"> </el-table-column>
      <el-table-column prop="getTime" label="选出时间" width="150"> </el-table-column>
      <el-table-column label="最高涨幅" width="150">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="至今涨幅" width="150">
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
    <div class="no-data" v-else-if="isFirst">
      <img :src="require('@/assets/img/no-data@2x.png')" />
      <div>数据正在运算中，请稍后…</div>
    </div>
    <div v-else class="no-data">
      <img :src="require('@/assets/img/no-data@2x.png')" />
      <div>当日没有选出标的</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
    isFirst: {
      type: Boolean,
    },
  },
};
</script>
