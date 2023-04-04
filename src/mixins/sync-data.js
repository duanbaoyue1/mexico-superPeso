import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';
import { ImagePreview } from 'vant';

export default {
  data() {
    window.onSyncAppData = async data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      // 上传抓取日志
      try {
        this.$http.post(`/api/userCollect/uploadCaptureLog`, {
          userId: this.userInfo.id,
          appName: this.appGlobal.appName,
          orderId: this.$route.query.orderId || '',
          type: '111',
          msg: data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    return {};
  },
  mounted() {},
};
