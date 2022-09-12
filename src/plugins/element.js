import Vue from 'vue'
import { Button, Table, TableColumn, Alert, Dialog, MessageBox, DatePicker } from 'element-ui'

Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Alert)
Vue.use(DatePicker)
Vue.prototype.$dm = MessageBox;
