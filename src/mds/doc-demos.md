<div style="display:none">
```
<script>
  import Demo1 from '@/demos/1'
  import Demo2 from '@/demos/2'
  import Demo3 from '@/demos/3'
  import Demo4 from '@/demos/4'
  import Demo5 from '@/demos/5'
  import Demo6 from '@/demos/6'
  import Demo7 from '@/demos/7'
  export default {
    components: {
      Demo1,
      Demo2,
      Demo3,
      Demo4,
      Demo5,
      Demo6,
      Demo7
    }
  }
</script>
```
</div>
<style lang="scss">
  .demo{
    border:1px solid #eee;
    padding:20px;
    margin-top:20px;
    margin-bottom:10px;
    input{
      border:1px solid #ddd
    }
    &+details{
      margin-bottom:50px;
    }
  }
</style>

## 单向数据流
<div class="demo">
  <demo1></demo1>
</div>
<details>
  <summary>示例代码</summary>

```
#src/demos/1/index.vue
<template>
  <div>
   <child1 :value="value" />
   <child2 :value="value" @change="handleChange"/>
  </div>
</template>

<script>
  import Child1 from './Child1'
  import Child2 from './Child2'
  export default {
    components: {
      Child1,
      Child2
    },
    data () {
      return {
        value: ''
      }
    },
    methods: {
      handleChange (e) { // 注册事件修改value 值
        this.value = e.target.value
      }
    }
  }
</script>

#src/demos/1/Child1.vue

<template>
   <div>value值：{{value}}</div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      }
    }
  }
</script>

#src/demos/1/Child2.vue
<template>
  <div>
   输入框：<input :value="value" @input="handleChange"/>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('change', e) // 通过触发事件模块修改父层value值
      }
    }
  }
</script>
```
</details>

## 双向数据流
<div class="demo">
  <demo2></demo2>
</div>
<details>
  <summary>示例代码</summary>
  
```
#src/demos/2/index.vue
<template>
  <div>
    <h2>value：{{value}}</h2>
    <child1 v-model="value" />
    <child2 :value.sync="value"/>
  </div>
</template>

<script>
  import Child1 from './Child1'
  import Child2 from './Child2'
  export default {
    components: {
      Child1,
      Child2
    },
    data () {
      return {
        value: ''
      }
    }
  }
</script>

#src/demos/2/Child1.vue
<template>
  <div>
   v-model模式修改：<input :value="value" @input="handleChange" />
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('input', e.target.value) // v-model绑定模式默认要触发input事件
      }
    }
  }
</script>

#src/demos/2/Child2.vue
<template>
  <div>
   props.sync模式修改：<input :value="value" @input="handleChange"/>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      }
    },
    methods: {
      handleChange (e) {
        this.$emit('update:value', e.target.value) // 通过触发事件update:prop
      }
    }
  }
</script>

```
</details>

## mixins合并对象
<div class="demo">
  <demo5></demo5>
</div>
<details>
  <summary>示例代码</summary>
  
```
<template>
  <div>
    value: {{value}} <br/>
    mounted console打印结果请看控制台
  </div>
</template>

<script>
  #src/demos/5/index.vue
  export default {
    mixins: [
      {
        props: {
          value: {
            type: String,
            default: 'mixins value'
          }
        },
        mounted () {
          console.log('mixins mounted')
        }
      }
    ],
    props: {
      value: {
        type: String,
        default: 'this value'
      }
    },
    mounted () {
      console.log('this mounted')
    }
  }
</script>

```
</details>

## Slot定义和$slots对象的应用
<div class="demo">
  <demo3></demo3>
</div>
<details>
  <summary>示例代码</summary>

```
#src/demos/3/index.vue
<template>
  <div>
    <Layout>
      <div slot="body">
        body内容区
      </div>
      <div>
        其他内容
      </div>
    </Layout>
  </div>
</template>

<script>
  import Layout from './Layout'
  export default {
    components: {
      Layout
    }
  }
</script>

#src/demos/3/Layout.vue
<template>
  <div class="layout">
    <!-- $slots对象，里面有外部传入vnode数组 -->
    <slot v-if="$slots.header" name="header"></slot>
    <my-header v-else></my-header>
    <!-- slot[name]="header"定义slot -->
    <slot name="body"></slot>
    <slot v-if="$slots.footer" name="footer"></slot>
    <div v-else>footer内容区</div>
    <!-- 没有name属性默认是default值 -->
    <slot></slot>
  </div>
</template>

<script>
  import MyHeader from './MyHeader'
  export default {
    components: {
      MyHeader
    },
    mounted () {
      console.log('$slots：', this.$slots)
    }
  }
</script>

<style lang="scss" scoped>
  .layout {
    div{
      border: 1px solid #999;
      line-height:60px;
      margin: 15px 0;
      padding-left:20px;
    }
  }
</style>

#src/demos/3/MyHeader.vue
<template>
  <div>
   header内容区
  </div>
</template>

```
</details>

## slot数据流传递
<div class="demo">
  <demo4></demo4>
</div>
<details>
  <summary>示例代码</summary>
  
```
#src/demos/4/index.vue
<template>
  <div>
    <list :data="list">
      <!-- 通过template模板配置slot-scope属性来获取循环当前项值 -->
      <template v-slot="scope">
        {{scope}}
      </template>
    </list>
  </div>
</template>

<script>
  import List from './List'
  export default {
    components: {
      List
    },
    data () {
      let list = []
      for (let i = 0; i < 10; i++) {
        list.push({
          id: Math.random()
        })
      }
      return {
        list
      }
    }
  }
</script>

#src/demos/4/List.vue
<template>
  <ul>
    <li v-for="(item, index) in data" :key="item">
      序号：{{index}}，循环项内容：<slot v-bind="item"></slot>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array
      }
    }
  }
</script>

```
</details>

## vnode&jsx函数渲染
<div class="demo">
  <demo6></demo6>
</div>
<details>
  <summary>示例代码</summary>
  
```
#src/demos/6/index.vue
<template>
  <div>
   <v-node v-model="value1" /> {{value1}} <br/>
   <jsx v-model="value2"/> {{value2}}
  </div>
</template>

<script>
  export default {
    components: {
      VNode: {
        props: {
          value: {
            type: String
          }
        },
        render (createElement) {
          return createElement('input', {
            attrs: {
              value: this.value
            },
            on: {
              input: this.handleInput
            }
          })
        },
        methods: {
          handleInput (e) {
            this.$emit('input', e.target.value)
          }
        }
      },
      Jsx: {
        props: {
          value: {
            type: String
          }
        },
        render (h) {
          return <input value={this.value} onInput={this.handleInput} />
        },
        methods: {
          handleInput (e) {
            this.$emit('input', e.target.value)
          }
        }
      }
    },
    data () {
      return {
        value1: 'vnode render',
        value2: 'jsx render'
      }
    }
  }
</script>

```
</details>

## v-bind&v-on结合$props&$listeners的妙用
<div class="demo">
  <demo7></demo7>
</div>
<details>
  <summary>示例代码</summary>
  
```
#src/demos/7/index.vue
<template>
  <el-input v-bind="$props" v-on="listeners"></el-input>
</template>
<script>
  import {Input} from '@element-ui'
  export default {
    props: {
      ...Input.props,
      placeholder: {
        type: String,
        default: '请输入帐号'
      }
    },
    computed: {
      listeners () {
        return {
          ...this.$listeners,
          change: this.handleChange
        }
      }
    },
    methods: {
      handleChange (value) {
        console.log('overwrite change')
        this.$emit('change', value)
      }
    }
  }
</script>
```
</details>