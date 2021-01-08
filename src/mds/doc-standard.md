<details>
<summary>vue文件命名要以大写开头的驼峰命名，除页面文件以外</summary>

```
如：
Password.vue
InputMoney.vue

//页面组件
home.vue
```
</details>
<details>
<summary>vue对象书写顺序 components>mixins>props>data>computed>watch>周期函数>methods</summary>

```
<template>
  <button @click="handleClick">点击我<button>
</template>
<script>
  export default {
    components: {
      ...
    },
    mixins: [...],
    props: {
      ...
    },
    data () {
      return {
        ...
      }
    },
    computed: {
      ...
    },
    watch: {
      ...
    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      handleClick () {
        console.log('handleClick')
      }
    }
  }
</script>
```
</details>

<details>
<summary>props赋值和注册事件要用简写方式</summary>

```
<template>
  bad: 
  <button v-bind:disabled="disabled" v-on:click="handleClick">点击我<button>
  good:
  <button :disabled="disabled" @click="handleClick">点击我<button>
</template>
<script>
  export default {
    data () {
      return {
        disabled: false
      }
    },
    methods: {
      handleClick () {
        console.log('handleClick')
      }
    }
  }
</script>
```
</details>

<details>
<summary>尽量要用'{{}}'来代替v-text</summary>

```
<template>
  bad: 
  <div v-text="text"></div>
  good: 
  <div>{{text}}</div>
</template>
<script>
  export default {
    data () {
      return {
        text: 'hello world'
      }
    }
  }
</script>
```
</details>

<details>
<summary>template模板内属性值要用双引号</summary>

```
<template>
  bad: 
  <input value='value' />
  good: 
  <input value="value" />
</template>
```
</details>

<details>
<summary>事件函数必需要以handle开头，以区分组件内部函数</summary>

```
<template>
  <button @click="handleClick">点击我<button>
</template>
<script>
  export default {
    methods: {
      handleClick () {
        console.log('handleClick')
      }
    }
  }
</script>
```
</details>
<details>
<summary>template模板内组件名都要全小写，如果没有slot要以"</>"形式去写</summary>

```
bad:
<template>
  <Child><Child>
</template>

good:
<template>
  <child/>
</template>
```
</details>

<details>
<summary>template模板内组件props和注册事件函数过多，超多5个要就换行</summary>

```
bad:
<template>
  <input :disabled="false" value="value" placeholder="请输入用户名" maxlength="20" @blur="handleBlur" @focus="handleFocus"/>
</template>

good:
<template>
  <input
    :disabled="false"
    value="value"
    placeholder="请输入用户名"
    maxlength="20"
    @blur="handleBlur"
    @focus="handleFocus"/>
</template>
```
</details>

<details>
<summary>要熟悉项目别名配置（/build/webpack.base.conf.js）,引入要别名，公共部分尽量用别名配置</summary>

```
bad:
script:
  import utils form '../../utils'
style:
  @import '../../styles/var';

good:
script:
  import utils form 'utils'
style:
  @import '~styles/var';
```
</details>

<details>
<summary>组件props和事件的命名应该参照w3c表单标签和现有的组件库(element)，这样能尽量保持命名一致性</summary>

```
 bad:
<template>
  <my-input :text="value" @text-change="handleChange"/>
</template>

good:
<template>
  <my-input :value="value" @change="handleChange"/>
</template>
```
</details>

<details>
<summary>二次封装组件要尽量可能保持原有的props和事件</summary>

``` 
#密码输入框组件
<template>
  <el-input v-bind="$props" v-on="$listeners" :type="myType">
    <template v-if="lockIcon" slot="prepend">
      <i class="iconfont" v-html="lockIcon"></i>
    </template>
    <div slot="append" @click="handleEye" class="eye" style="cursor:pointer;">
      <i class="iconfont" v-html="myType=='password' ? icons[0] : icons[1]"></i>
    </div>
  </el-input>
</template>
<script>
  import {Input} from '@element-ui'
  export default {
    componentName: 'EPassword',
    props: {
      ...Input.props, // 引入element input组件的props
      placeholder: { // 可以重写Input.props的placeholder
        type: String,
        default: '请输入密码'
      },
      type: {
        type: String,
        default: 'password'
      },
      lockIcon: {
        type: String,
        default: '&#xe633;'
      },
      icons: {
        type: Array,
        default () {
          return ['&#xe60b;', '&#xe622;']
        }
      }
    },
    data () {
      return {
        myType: this.type
      }
    },
    methods: {
      handleEye () {
        this.myType = this.myType === 'password' ? 'text' : 'password'
      }
    }
  }
</script>
```
</details>

<details>
<summary>表单类组件必需有支持单向(value&change事件)和双向(v-model)数据模式，blur|focus|keyup事件也要考虑组件是否需要暴露出来</summary>

```
<template>
  <input :value="value" @change="handleChange" />
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
        this.$emit('input', e.target.value).$emit('change', e.target.value) //触发input事件可以实现v-model双向数据绑定
      }
    }
  }
</script>
```
</details>

<details>
<summary>css要以-中划线方式命名，不要以驼峰或者_下划线命名</summary>

```
bad:
<style lang="scss">
  .module_userName {
    font-size: 14px;
  }
  // 复杂块名：action_sheet
  .action_sheet__item {
    font-size: 14px;
  }
</style>
good:
<style lang="scss">
  .module-username {
    font-size: 14px;
  }
  // 复杂块名：action-sheet
  .action-sheet--item {
    font-size: 14px;
  }
</style>
```
</details>

<details>
<summary>jsx渲染方案可以用来代替vnode渲染方案，其他的尽可能的用渲染模板方案</summary>

```
无
```
</details>

更好的vue风格：https://cn.vuejs.org/v2/style-guide/index.html
