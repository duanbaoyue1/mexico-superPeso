<template>
  <div class="web-layout">
    <router-view />
  </div>
</template>

<style lang="scss">
html {
  min-height: 100%;
}
body {
  margin: 0;
}
.tips-toast-web {
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
    background: transparent !important;
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

.web-layout {
  .define-pagination {
    .el-pagination button,
    .el-pager li {
      background-color: transparent;
    }
    .el-pagination .btn-next .el-icon,
    .el-pagination .btn-prev .el-icon {
      font-size: 18px;
    }
    .el-pager li {
      font-size: 16px;
    }
    .el-pagination {
      color: #666;
    }
    .el-pager li.active,
    .el-pager li:hover {
      color: #f9daba;
    }
  }
  .width-container {
    width: 1200px;
    margin: 0 auto;
  }

  .define-table {
    background: transparent;
    .el-table {
      background: transparent;
      border-color: #666;
      tr {
        background: transparent;
        font-size: 14px;
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
      font-size: 14px;
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
      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      line-height: 17px;
    }
    .el-table td.el-table__cell {
      border-bottom: 1px solid #666;
    }
    .el-table--border .el-table__cell {
      border-right: 1px solid #666;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
      background: transparent;
    }
    .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      border-bottom: 1px solid #666 !important;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #666 !important;
    }

    .no-data {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #bbbcbe;
      line-height: 18px;
      margin-top: 30px;
      margin-bottom: 30px;
      img {
        margin: 0 auto;
        width: 100px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
