/* @flow */

export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag // 标签名 
    this.data = data // 属性 如id,class
    this.children = children // 子节点
    this.text = text // 文本内容
    this.elm = elm // 所对应的真实节点
    this.ns = undefined // 节点的namespace
    this.context = context // 该vnode对应的实例
    this.fnContext = undefined // 函数组件上下文
    this.fnOptions = undefined // 函数组件配置
    this.fnScopeId = undefined //函数组件的scopeId
    this.key = data && data.key // 节点绑定的key 如v-for
    this.componentOptions = componentOptions // 组件VNode的options
    this.componentInstance = undefined // 组件的实例
    this.parent = undefined // vnode组件的占位符节点
    this.raw = false // 是否为平台标签或文本
    this.isStatic = false // 静态节点
    this.isRootInsert = true // 是否作为根节点插入
    this.isComment = false //是否是注释节点
    this.isCloned = false // 是否是克隆节点
    this.isOnce = false // 是否是v-once节点
    this.asyncFactory = asyncFactory //异步工厂方法
    this.asyncMeta = undefined // 异步meta
    this.isAsyncPlaceholder = false //是否为异步占位符
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

//  注释节点
//  创建一个空的Vnode,有效属性只有text和isComment来表示一个注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

//  文本节点
//  只设置text属性、描述的是标签内的文本
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
//  优化浅克隆
// 用于静态节点和插槽节点，因为它们可以跨多个应用程序重用
// 多个渲染，克隆它们可以避免DOM操作依赖于
// 它们的元素引用。
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
