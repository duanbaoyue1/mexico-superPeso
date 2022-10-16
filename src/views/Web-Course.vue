<template>
  <div class="back">
    <div class="top-header">
      <div class="width-container">
        <div class="pro-info">
          <img class="img-name" :src="require('@/assets/img/web/course/name@2x.png')" />
          <div class="sub-title">实战培训教程</div>
          <div class="pro-tips">课程详细讲解策略选股逻辑和技巧, 并通过赠送的策略选股工具 实战验证, 理论与实际结合!</div>
        </div>
        <div class="buy-info">
          <!-- TODO 价格定死？ -->
          <div id="price">29800元/半年</div>
          <div class="sub-buy"><span>赠</span><span>全套量化策略选股工具一个月使用权</span></div>
          <div class="buy-btn" @click="toBuyP">
            <img v-if="bought" :src="require('@/assets/img/web/buy-btn2@2x.png')" />
            <img v-else :src="require('@/assets/img/web/buy-btn@2x.png')" />
          </div>
          <!-- TODO -->
          <div class="learn-num">时长：38小时 &nbsp; 学习人数: 133</div>
        </div>
      </div>
    </div>

    <div class="content-area">
      <ul class="tab-choose">
        <li :class="{ active: curIndex == 0 }" @click="curIndex = 0">课程介绍</li>
        <li :class="{ active: curIndex == 1 }" @click="curIndex = 1">视频目录</li>
      </ul>
      <div v-show="curIndex == 0">
        <div class="course-module">
          <header>课程简介</header>
          <div>
            <div>这是一套量化交易理论与实战结合的课程体系，视频培训与赠送的量化策略选股工具结合，学完马上在市场进行验证，加快课程的吸收，真正做到学以致用！华氏量化策略系统经过八年的研发，实际开发的策略有二十余种，本课程选择了其中最好的三个策略，对其策略的原理进行深度剖析，让普通投资者也能理解其中的选股逻辑。其中大单回调策略就有高胜率、止损空间小、盈利空间大的特点，是所有策略中最好的策略，经常出现连板票，并且是在龙头的上涨初期被抓取，学员可以通过策略选股工具的历史数据进行验证！</div>
            <br />
            <div>为让新手投资者更快的学会如何投资，本课程还包括基础且实用的教程体系。包括炒股软件的组合配置、软件关键功能的使用方法、分时买卖交易理论、日线分析理论、主力操盘实战分析、主力大单分析方法等等接地气的炒股技巧。</div>
          </div>
        </div>

        <div class="course-module outline">
          <header>课程大纲</header>
          <div>
            <div v-for="course in courses" :key="course.classType">
              <p class="course-title">
                {{ course.className }}
              </p>
              <ul>
                <li v-for="video in course.videos" :key="video.id">{{ video.title }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="course-module">
          <header>课程须知</header>
          <div>
            <p>1.市场有风险，投资需谨慎。</p>
            <p>2.本专栏为视频形式，订阅成功后有效期为6个月。</p>
            <p>3.本专栏为虚拟产品，一经订阅成功概不退款，请您理解。</p>
            <p>4.如有任何疑问请添加小助理微信号caihuayu-an8,或者电话021-63308189，联系客服咨询。</p>
          </div>
        </div>
      </div>
      <div v-show="curIndex == 1">
        <div class="course-module outline-2">
          <div>
            <div v-for="course in courses" :key="course.classType">
              <p class="course-title">
                {{ course.className }}
              </p>
              <p class="desc">{{ course.description }}</p>
              <ul>
                <li v-for="video in course.videos" :key="video.id" @click="playCourse(video)"><img :src="require('@/assets/img/web/course/shipin@2x.png')" />视频：{{ video.title }}<span class="try" v-if="video.tryEnable">试看</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <pc-video-modal :initVideoIndex="initVideoIndex" :videos="videos" :showOneVideo="showOneVideo" @close-play="closePlayVideo"></pc-video-modal>
    </div>
    <login ref="login" v-if="loginShow" />
    <payment-List ref="paymentList" :type="proId" />
  </div>
</template>

<script>
import paymentList from '@/components/paymentList.vue'; //支付
import PcVideoModal from '@/components/pc-video-modal.vue';
import axios from 'axios';
import login from '@/components/login.vue';

export default {
  components: {
    PcVideoModal,
    login,
    paymentList,
  },
  data() {
    return {
      // 是否显示试看视频
      showOneVideo: false,
      curIndex: 1,
      initVideoIndex: -1,
      // 视频列表
      videos: [],
      // 课程列表
      courses: [],
      // 产品id , 以便于购买跳转
      proId: this.$route.query.proId,
      token: '',
      // 是否购买
      bought: false, // 是否登陆
      loginShow: false, // 登录显示
      logins: false,
    };
  },
  mounted() {
    this.inti();
    this.getVideoClasses();
  },

  methods: {
    // TODO判断课程是否购买
    inti() {
      axios({
        method: 'post',
        url: '/userreg/ucenter/queryUserProduct',
      }).then((re) => {
        let res = re.data;
        if (res.code && res.code == 200) {
          this.logins = true; // 已登录
          var data = res.data;
          if (data.length == 0) {
            // 无权限
            this.bought = false;
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id == this.proId || data[i].id == 1 || data[i].id == 2 || data[i].id == 3) {
                var newdate = new Date();
                var date = new Date(data[i].date);
                if (date <= newdate) {
                  // 无权限
                  this.bought = false;
                } else {
                  // 有权限
                  this.bought = true;
                }
              }
            }
          }
        } else if (res.code == -1) {
          this.bought = false;
          this.logins = false; // 未登录
        } else {
          this.bought = false;
        }
      });
    },

    playCourse(video) {
      // 未购买课程且不支持试看 直接返回
      if (!this.bought && !video.tryEnable) {
        return;
      }
      var curIndex = -1;
      this.videos.forEach((item, index) => {
        if (video.id == item.id) {
          curIndex = index;
        }
      });
      // 未购买则视频列表显示一条
      if (!this.bought) {
        this.showOneVideo = true;
      } else {
        this.showOneVideo = false;
      }
      this.initVideoIndex = curIndex;
    },

    getVideoClasses() {
      this.$http.get(`/core/api/high_point_video_items/`).then((res) => {
        var courses = [];
        var videos = [];
        Object.keys(res.data).forEach((item) => {
          courses.push(res.data[item]);
          videos = videos.concat(res.data[item].videos);
        });
        this.courses = courses;
        this.videos = videos;
      });
    },

    closePlayVideo() {
      this.initVideoIndex = -1;
    },

    toBuyP() {
      // 未登录
      if (this.logins == false) {
        this.loginShow = true;
      } else {
        setTimeout(() => {
          this.$refs.paymentList.showPayInfoDialog();
        });
      }
    },
  },
};
</script>

<style lang="scss">
html {
  background-color: #0f0f12;
}

.width-container {
  width: 1200px;
  margin: 0 auto;
}

.back {
  background: #0f0f12;
}

.top-header {
  background-image: url('../assets/img/web/course/beijing@2x.png');
  background-size: cover;
  background-repeat: no-repeat;
  height: 328px;
  .sub-title {
    font-size: 40px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #f4f4f4;
    line-height: 52px;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  > div {
    padding-top: 39px;
    padding-left: 30px;
    padding-right: 30px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .pro-info {
      width: 600px;
    }
    .buy-info {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: end;
      .learn-num {
        margin-top: 11px;
        font-size: 15px;
        color: #ffffff;
        line-height: 20px;
      }
      .sub-buy {
        width: 280px;
        height: 30px;
        background: #cea68d;
        border-radius: 2px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        span {
          &:first-child {
            font-size: 18px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #552620;
            line-height: 24px;
            margin-right: 4px;
            margin-left: 6px;
          }
          &:last-child {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 250px;
            height: 26px;
            background: #ffffff;
            border-radius: 2px;
            font-size: 15px;
            font-family: MicrosoftYaHei;
            color: #eb333b;
            line-height: 20px;
          }
        }
      }
      #price {
        font-size: 52px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ffffff;
        line-height: 52px;
        margin-bottom: 20px;
      }
      .buy-btn {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #ffffff;
        line-height: 21px;
        cursor: pointer;
        img {
          width: 180px;
          margin-left: 10px;
        }
      }
    }
    .pro-tips {
      font-size: 16px;
      font-weight: 400;
      color: #adadad;
      line-height: 21px;
      margin-top: 30px;
    }
  }
}

.content-area {
  background: #15171e;
  width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: -35px;
  padding: 30px;
  .more-data {
    padding: 8px 0;
    margin: 0 auto;
    border: 1px solid #666;
    border-top: none;
    text-align: center;
    font-size: 14px;
    color: #eb333b;
    line-height: 19px;
    cursor: pointer;
  }
}

.img-name {
  height: 55px;
  display: block;
}

.tab-choose {
  font-size: 22px;
  font-family: MicrosoftYaHei;
  color: #ffffff;
  line-height: 29px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  li {
    margin-right: 150px;
    position: relative;
    cursor: pointer;
    &:hover {
      color: #ffd1b6;
    }
    &::after {
      position: absolute;
      content: ' ';
      width: 88px;
      height: 3px;
      background: transparent;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
    &.active::after {
      background: #ffd1b6;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

.course-module {
  margin-bottom: 30px;
  font-size: 15px;
  color: #bbbcbe;
  line-height: 26px;
  p {
    margin-bottom: 10px;
  }
  header {
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #ffd1b6;
    line-height: 24px;
    padding-left: 16px;
    margin-bottom: 20px;
    position: relative;
    &::after {
      position: absolute;
      content: ' ';
      width: 3px;
      height: 14px;
      background: #ffd1b6;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &.outline {
    ul {
      margin-bottom: 20px;
      li {
        margin-bottom: 10px;
      }
    }
    .course-title {
      font-size: 15px;
      font-weight: bold;
      color: #ffffff;
      line-height: 20px;
      margin-bottom: 15px;
    }
  }

  &.outline-2 {
    .desc {
      font-size: 15px;
      font-family: MicrosoftYaHei;
      color: #bbbcbe;
      line-height: 20px;
      margin-bottom: 20px;
    }
    ul {
      margin-bottom: 30px;
      li {
        margin-bottom: 20px;
        color: #ffffff;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 20px;
          margin-right: 10px;
        }
        .try {
          width: 54px;
          height: 26px;
          background: #ffffff;
          border-radius: 13px 13px 13px 13px;
          margin-left: 10px;
          font-size: 13px;
          color: #eb333b;
          line-height: 26px;
          text-align: center;
          &:hover {
            background: linear-gradient(90deg, #ffb1b1 0%, #e10000 100%);
            color: #fff;
          }
        }
      }
    }
    .course-title {
      font-size: 18px;
      font-weight: bold;
      color: #ffd1b6;
      line-height: 24px;
      margin-bottom: 15px;
    }
  }
}
</style>
