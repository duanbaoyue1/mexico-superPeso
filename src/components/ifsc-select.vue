<template>
  <div class="ifsc-select">
    <div class="content-wrapper">
      <div class="head">
        <m-icon class="close" type="close" @click="$emit('close')" />
        Select Your IFSC
      </div>
      <ul class="nav">
        <li :class="{ active: curNav == 1 }" @click="toggleNav(1)">Bank</li>
        <li :class="{ active: curNav == 2 }" @click="toggleNav(2)">State</li>
        <li :class="{ active: curNav == 3 }" @click="toggleNav(3)">City</li>
        <li :class="{ active: curNav == 4 }" @click="toggleNav(4)">Branch</li>
      </ul>
      <ul class="items">
        <li v-for="item in banks" :class="{ active: classActive(item) }" :key="item.id" @click="chooseItem(item)">
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="submit">
        <button :disabled="!choosedBranch" @click="complete">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import mIcon from './m-icon.vue';
export default {
  components: { mIcon },
  created() {
    // 查询所有的银行
    this.queryBanks();
  },

  computed: {
    classActive() {
      return (item) => {
        return (this.curNav == 1 && this.choosedBank == item.id) || (this.curNav == 2 && this.choosedState == item.id) || (this.curNav == 3 && this.choosedCity == item.id) || (this.curNav == 4 && this.choosedBranch == item.id);
      };
    },
  },

  data() {
    return {
      curNav: 1,
      choosedBank: '',
      choosedState: '',
      choosedCity: '',
      choosedBranch: '',
      choosedBranchName: '',
      choosedIfsc: '',
      banks: [],
      states: [],
      cities: [],
      branches: [],
    };
  },
  methods: {
    chooseItem(item) {
      if (this.curNav == 1) {
        this.choosedBank = item.id;
        this.queryBanks(item.id);
      } else if (this.curNav == 2) {
        this.choosedState = item.id;
        this.queryBanks(item.id);
      } else if (this.curNav == 3) {
        this.choosedCity = item.id;
        this.queryBanks(item.id);
      } else if (this.curNav == 4) {
        this.choosedBranch = item.id;
        this.choosedBranchName = item.name;
        this.choosedIfsc = item.ifsc;
      }
      if (this.curNav < 4) {
        this.curNav++;
      }
    },
    async queryBanks(parentId) {
      parentId = parentId || '';
      let data = await this.$http.post(`/wvpwoojady/wvpwoojadyuwuxjgwh`, { parentId: parentId });
      // 查询所有的银行
      this.banks = data.data.list;
    },
    toggleNav(index) {
      if (index == 2 && !this.choosedBank) return;
      if (index == 3 && !this.choosedState) return;
      if (index == 4 && !this.choosedCity) return;
      if (index == 1) {
        this.queryBanks();
      } else if (index == 2) {
        this.queryBanks(this.choosedBank);
      } else if (index == 3) {
        this.queryBanks(this.choosedState);
      } else {
        this.queryBanks(this.choosedCity);
      }
      this.curNav = index;
    },
    complete() {
      
      this.$emit('complete', { choosedIfsc: this.choosedIfsc, choosedBank: this.choosedBank, choosedState: this.choosedState, choosedCity: this.choosedCity, choosedBank: this.choosedBank, choosedBranchName: this.choosedBranchName });
    },
  },
};
</script>

<style lang="scss" scoped>
.ifsc-select {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  .content-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0%;
    width: 360px;
    height: 600px;
    background: #ffffff;
    border-radius: 24px 24px 0px 0px;

    .head {
      padding: 36px 0 30px;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      line-height: 30px;
      position: relative;
      .close {
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }
    .nav {
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      display: flex;
      li {
        flex: 1;
        text-align: center;
        position: relative;
        &::after {
          position: absolute;
          content: ' ';
          bottom: -8px;
          width: 90px;
          height: 6px;
          background: transparent;
          border-radius: 18px;
          left: 0;
        }
        &.active {
          &::after {
            background: #fd973f;
          }
        }
      }
    }

    .items {
      padding: 10px 0;
      padding-top: 10px;
      margin-top: 10px;
      height: 370px;
      overflow-y: scroll;
      li {
        width: 359px;
        height: 40px;
        border-radius: 20px;
        font-size: 16px;
        line-height: 20px;
        color: #999999;
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        &.active {
          border: 2px solid #1143a4;
          color: #1143a4;
          font-weight: 500;
        }
      }
    }

    .submit {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
      button {
        margin: 20px 20px 20px;
        height: 48px;
        width: 320px;
        border-radius: 14px;
        font-size: 18px;
        font-weight: 900;
        background: #1143a4;
        color: #fff;
        line-height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        box-sizing: border-box;
        padding: 0;
        &:disabled {
          background: #e9e9e9;
          color: #999999;
        }
      }
    }
  }
}
</style>
