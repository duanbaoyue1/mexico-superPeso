<template>
  <div class="web-layout">
    <router-view class="true-" />
    <message-box />
  </div>
</template>

<style lang="scss" scoped>
html {
  min-height: 100%;
}
body {
  margin: 0;
  font-size: 12px;
}
.web-layout {
  height: 100%;
}

body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}
body {
  /* font-family: 'Microsoft YaHei', Avenir, Arial, Helvetica, sans-serif, '宋体'; */
  font-family: Roboto-Regular, Roboto;
  word-break: break-all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
fieldset,
img {
  border: 0;
}
address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
  font-style: normal;
  font-weight: normal;
}
ol,
ul {
  list-style: none;
}
caption,
th {
  text-align: left;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 100%;
  font-weight: normal;
}
q:before,
q:after {
  content: '';
}
abbr,
acronym {
  border: 0;
}
a {
  color: #333;
  text-decoration: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
a,
input,
select {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-border-radius: 0;
}

.el-message-box {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px !important;
  background: #ffffff;
  border-radius: 8px !important;
}

.color-red {
  color: #ff4b3f;
}

.btn-default {
  height: 48px;
  background: #1143a4;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
  line-height: 24px;
  border: 1px solid #1143a4;
  padding: 0;
}

.btn-line {
  height: 48px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #1143a4;
  font-size: 18px;
  font-weight: 900;
  color: #1143a4;
  line-height: 24px;
  padding: 0;
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
</style>
