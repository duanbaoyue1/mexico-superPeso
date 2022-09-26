import Vue from 'vue'
import { Button, Table, TableColumn, Alert, Dialog, MessageBox, DatePicker,Input,Checkbox,Select,Menu ,Option,MenuItem} from 'element-ui'

Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Alert)
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Menu)
Vue.use(Option)
Vue.use(MenuItem)
Vue.prototype.$dm = MessageBox;
