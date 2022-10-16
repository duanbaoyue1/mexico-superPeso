<template>
  <div class="m-layout">
    <router-view />
  </div>
</template>

<style lang="scss">
.tips-toast {
  padding-bottom: 0 !important;
  .el-message-box__header {
    padding-top: 16px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    padding-bottom: 0;
  }
  .el-message-box__title {
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    text-align: center;
    line-height: 24px;
  }
  .el-button--primary {
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    border: none;
    padding: 0;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    width: 120px;
    height: 24px;
    background: #f2f6f7 !important;
    border-radius: 12px;
    margin: 15px auto;
    font-size: 13px;
    font-weight: 400;
    color: #333333 !important;
    line-height: 18px;
  }
  .el-message-box__btns {
    border-top: none;
    padding: 0px !important;
    text-align: center !important;
  }
  .el-message-box__content {
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
    line-height: 21px;
    padding-bottom: 0px !important;
    ul {
      li {
        margin-left: 20px;
        list-style: auto;
      }
    }
  }
}

.m-layout {
  .define-pagination {
    .el-pager li.active {
      color: #e60100;
    }
  }

  .define-table {
    .el-table thead {
      .cell {
        font-weight: 500;
        color: #333333;
      }
    }
    .el-table--small .el-table__cell {
      padding: 3px 0px;
      text-align: center;
    }
    .el-table .cell {
      font-size: 10px;
      // color: #333333;
      line-height: 13px;
      padding: 0;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .no-data {
      text-align: center;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
      line-height: 18px;
      img {
        width: 60px;
        margin: 0 auto;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
