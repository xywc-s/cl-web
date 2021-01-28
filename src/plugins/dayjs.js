import * as dayjs from 'dayjs';
import zhCn from 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import Vue from 'vue';

dayjs.extend(relativeTime)
dayjs.locale(zhCn)

Vue.prototype.$dayjs = dayjs

export default dayjs
