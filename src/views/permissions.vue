<template>
  <div class="permissions">
    <div class="header-wrapper">
      <div>PERMISSION</div>
      <div class="bottom">
        <p>Hi,there</p>
        <p>To assess your eligibility and facilitate faster disbursal of your loan, we need these permissions.</p>
      </div>
      <m-icon class="icon" type="permissions/back2" :width="161" :height="161"></m-icon>
    </div>
    <div class="content">
      <div class="module" v-for="item in lists" :key="item.iconName">
        <div class="header">
          <m-icon class="icon" :type="item.iconName" :width="item.iconWidth" :height="item.iconHeight"></m-icon>
          <span>{{ item.title }}</span>
        </div>
        <div class="desc" v-html="item.desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [
        {
          iconName: 'permissions/icon1',
          title: 'Device Information',
          desc: 'The information we collect from your device includes hardware model, build model, memory, storage; unique device identifiers such as IMEI, serial number, SSAID; SIM information including network operator, roaming status, MNC and MCC codes, WIFI information including MAC address and mobile network information to uniquely identify the device, ensure no unauthorized device is acting on your behalf and prevent fraud.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon2',
          title: 'Installed Applications',
          desc: "We will get a list of installed applications' data information, including application name, package name, installation time, update time, version name and version code of each installed application on the device to evaluate your credit value and enrich your personal data with pre approved custom loan offers.",
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon3',
          title: 'SMS',
          desc: 'Collect and monitor only financial transaction SMS which includes name of transacting party, a description of the transaction and transaction amount for the purpose of performing a credit risk assessment. This credit risk assessment enables faster and quicker loan disbursal. No personal SMS are accessed, read or collected.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon4',
          title: 'Storage',
          desc: 'This permission is required so that users loan account statements can be securely downloaded and saved on users phone, and so that user can upload the right documents for a faster approval and disbursal of the loan. Also, this helps provide a very smooth seamless experience while using the app.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon5',
          title: 'Contacts',
          desc: 'As a part of our loan journey, we require references from the Loan applicant. In this regard, during filing the form on our App, we collect your contact information to detect close contacts to enable you to autofill the data during the loan application process. <br/>Furthermore, we collect contact information from your device for the purposes of risk analysis by enabling us to detect credible references. The more credible the references are, the lower is the risk associated to a User.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon6',
          title: 'Location',
          desc: 'User location helps to locate and verify the address which helps in making better credit risk decisions and fasten the Know Your Customer (KYC) process.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon7',
          title: 'Camera',
          desc: 'Camera access is required so that user can easily scan or capture identity documents, etc. and save time by allowing us to auto-fill the required data and helps in improving the user journey and experience.',
          iconWidth: 18,
          iconHeight: 18,
        },
        {
          iconName: 'permissions/icon8',
          title: 'Phone State',
          desc: 'Collect and monitor specific information about your phone like your phone’s unique device identifier, user profile information as this information helps us in uniquely identifying a user, so that we can detect and prevent any unauthorized device from acting on your behalf. This enables us to detect fraud and manage risks better.',
          iconWidth: 18,
          iconHeight: 18,
        },
      ],
    };
  },

  mounted() {
    setTimeout(() => {
      this.toAppMethod('testMethod', { b: 1, c: 2 });
    }, 2000);
  },
};
</script>

<style lang="scss" scoped>
.permissions {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #3190f0 0%, #185cb4 100%);

  .header-wrapper {
    height: 237px;
    position: relative;
    .icon {
      position: absolute;
      top: 42px;
      right: -10px;
    }
    div {
      &:first-child {
        padding-top: 89px;
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
        padding-left: 20px;
        line-height: 42px;
      }
      &.bottom {
        height: 90px;
        background: #d8e4fb;
        border-radius: 14px;
        padding: 16px 20px;
        margin: 16px 20px 0;
        box-sizing: border-box;
        p {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          line-height: 16px;
          &:first-child {
            font-size: 16px;
            font-weight: bold;
            color: #1143a4;
            line-height: 24px;
            margin-bottom: 2px;
          }
        }
      }
    }
  }

  .content {
    border-radius: 24px 24px 0px 0px;
    padding: 75px 20px 100px;
    margin-top: -45px;
    background: #fff;
    .module {
      margin-bottom: 20px;
      .header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        position: relative;
        padding-left: 18px;
        &::before {
          position: absolute;
          content: ' ';
          width: 6px;
          height: 16px;
          background: #1143a4;
          border-radius: 3px;
          left: 0;
        }
        .icon {
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          font-weight: 900;
          color: #333;
          line-height: 18px;
        }
      }
      .desc {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
        word-break: break-word;
      }
    }
  }
}
</style>
