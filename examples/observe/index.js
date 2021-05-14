//定义一个普通通知的回调函数
// const callback = function (newVal, oldVal) {
//   console.log(newVal + '---------' + oldVal);
// }

function def(obj,key,val,enumerable) {
  Object.defineProperty(obj,key, {
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
    value: val
  })
}

//Array原型方法重定义
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methodsToPatch.forEach(function (method) {
  const original = arrayProto[method]
  
  def(arrayMethods, method, function (...args) {
    let oldVal = this.slice(0);
    const result = original.apply(this, args);
    // observe(this) //操作数组之后重新监听，可优化为只有当向数组中添加元素时才需要对新元素进行监听
    
    // 如果 method 是以下三个之一，说明是新插入了元素
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
    //Array.prototype.splice(x,0,value)
      case 'splice':  inserted = args.slice(2); break;
    }
    if(inserted) observe(inserted)
    this.__ob__.$callback(oldVal,this);
    return result;
  })
})


//响应式
class Observer {
  constructor (obj, callback) {
    this.value = obj;
    this.$callback = callback;
    def(obj,'__ob__',this)
    if(Array.isArray(obj)) {
      obj.__proto__ = arrayMethods;  //重写原型链
      this.observeArray(obj)
    }else {
      this.walk(obj);
    }
  }

  //监听数组
  observeArray(obj) {
    obj.forEach(function(item){
      observe(item)
    })
  }

  walk (obj) {
    const keys = Object.keys(obj);
    // keys.forEach(function(key,index,keyArray) {
    //   this.observe(obj,key)
    // },this)
    for(let i = 0; i < keys.length; i++) {
      this.defineReactive(obj,keys[i])
    }
  }

  defineReactive(obj,key) {
    const that = this;
    let oldVal = obj[key];
    Object.defineProperty(obj,key, {
      enumerable: true,
      configurable: true,
      get: function () {
        return oldVal
      },
      set: function (newVal) {
        if(newVal === oldVal) return
        that.$callback(newVal,oldVal);
        oldVal = newVal
      }
    })
    if(Object.prototype.toString.call(obj[key]) === '[object Object]') {
      that.walk(obj[key])
    }
  }
}

export function observe (obj,cb) {
  if(obj !== null && typeof obj === 'object') {
    new Observer(obj,cb)
  }
}

//将data代理到实例上
export function proxy (target,data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return this._data[key]
      },
      set: function proxySetter (val) {
        target._data[key] = val;
      }
    })
  })
}



 