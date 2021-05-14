import { observe, proxy } from "./index.js"

class Vue {
  constructor(option) {
    this._data = option.data;
    // 将data代理到实例上去
    // 代理前 vm._data.key
    // 代理后可以直接通过实例获取data上的属性 vm.key
    proxy(this,option.data);  
    //设置响应式
    observe(this._data,option.render);
  }
}

var app = new Vue({
  el: '#app',
  data: {
    text: 'text',
    text2: 'text2'
  },
  render(newVal,oldVal) {
    console.log(newVal+'----'+oldVal);
  }
})