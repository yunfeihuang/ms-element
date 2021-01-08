# 常见问题之Template区块

<details>
 <summary>使用v-for指令时不要忘记赋值key</summary>

```
<template>
  <ul>
    <li v-for="(item, index) in list" :key="index">
      {{item}}
    </li>
  <ul>
</template>
<script>
  export default {
    data () {
      return {
        list: [1, 2, 3, 4, 5]
      }
    }
  }
</script>
```
</details>

<details>
  <summary>template标签下必须只一个根标签或者组件</summary>

```
<template>
  <div>root tag</div>
</template>
<script>
  export default {}
</script>
```
</details>


<details>
<summary>v-model不能直接绑定props，props只能在外部改变</summary>

```
<template>
  <input v-model="value" />
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
```
</details>

<details>
<summary>注册事件没有入参函数不要调用函数</summary>

```
<template>
  <!--应该要 @click="handleClick" -->
  <button @click="handleClick()">点击我</button>
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
<summary>想在事件函数获取事件对象要传入$event关键字</summary>

```
<template>
  <button @click="handleClick($event)">点击我</button>
</template>
<script>
  export default {
    methods: {
      handleClick (e) {
        console.log('event:', e)
      }
    }
  }
</script>
```
</details>

<details>
<summary>需要在事件函数缓存入参数据可以直接调用函数</summary>

```
<template>
  <ul>
    <li v-for="(item, index) in list" :key="index" @click="handleClick(index)">
      {{item}}
    </li>
  <ul>
</template>
<script>
  export default {
    data () {
      return {
        list: [1, 2, 3, 4, 5]
      }
    },
    methods: {
      handleClick (index) {
        console.log('index:', index)
      }
    }
  }
</script>
```
</details>

<details>
<summary>组件内要慎用id dom操作, id是唯一的，如果页面同时出现两个此组件就会有异常</summary>

```
<template>
  <button @click="handleClick($event)" id="btn-test">点击我</button>
</template>
<script>
  export default {
    methods: {
      handleClick (e) {
        document.getElementById('btn-test').disabled = true
      }
    }
  }
</script>
```
</details>

<details>
<summary>尽量不要通过ref特性修改UI和关联数据流，所有的ui变化尽量要用props和data</summary>

```
bad: 
<template>
  <child ref="child" @click="handleClick" />
</template>
<script>
  export default {
    components: {
      child: {
        props: {
          disabled: {
            type: Boolean,
            default: false
          }
        },
        data () {
          return {
            loading: false
          }
        },
        render (createElement) {
          return createElement('div', {
            domProps: {
              innerHTML: this.disabled + this.loading
            }
          })
        }
      }
    },
    methods: {
      handleClick () {
        if (this.$refs.child.disabled) {
          console.log('disabled next')
        } else {
          this.$refs.child.loading = true
          console.log('go to next')
        }
      }
    }
  }
</script>

good: 
<template>
  <child :disabled="disabled" :loading="loading" @click="handleClick" />
</template>
<script>
  export default {
    components: {
      child: {
        props: {
          disabled: {
            type: Boolean,
            default: false
          },
          loading : {
            type: Boolean,
            default: false
          }
        },
        render (createElement) {
          return createElement('div', {
            domProps: {
              innerHTML: this.disabled + this.loading
            }
          })
        }
      }
    },
    data () {
      return {
        disabled: false,
        loading: true
      }
    },
    methods: {
      handleClick () {
        if (this.disabled) {
          console.log('disabled next')
        } else {
          this.loading = true
          console.log('go to next')
        }
      }
    }
  }
</script>
```
</details>

<details>
<summary>避免v-if 和 v-for 同时用在一个元素上（性能问题）</summary>


  https://cn.vuejs.org/v2/style-guide/index.html#%E9%81%BF%E5%85%8D-v-if-%E5%92%8C-v-for-%E7%94%A8%E5%9C%A8%E4%B8%80%E8%B5%B7-%E5%BF%85%E8%A6%81
</details>

# 常见问题之Style区块

<details>
<summary>优先使用预处理器编写样式</summary>

```
bad: 
<style>
  .css {
    font-size: 14px;
  }
</style>

good: 
<style lang="scss">
  .css {
    font-size: 14px;
  }
</style>
```
</details>

<details>
<summary>禁止写可读性可维护差的样式代码</summary>

```
bad: 
<style lang="scss">
  .content h1{font-size:22px}
  .content p{font-size:16px}
</style>

good: 
<style lang="scss">
  .content{
    h1{
      font-size:22px
    }
    p{
      font-size:16px
    }
  }
</style>
```
</details>

<details>
<summary>避免设计嵌套过深的选择器, 影响性能</summary>

```
bad: 
<style lang="scss">
  .list{
    .list-item{
      section{
        h4 {
          font-size: 20px;
        }
      }
    }
  }
  #编译后结果：.list .list-item section h4
</style>

good: 
<style lang="scss">
  .list{
    h4 {
      font-size: 20px;
    }
  }
  #编译后结果：.list h4
</style>
```
</details>

<details>
<summary>组件内style块不允许直接使用公共样式的选择器和ui组件库的相关选择器</summary>

```
bad: 
<style lang="scss">
  .el-input{
    background:red;
  }
</style>
good:
<style lang="scss">
  .my-input{
     .el-input{
      background:red;
     }
   }
</style>
```
</details>

<details>
<summary>业务组件style标签要加scoped属性,除非这个组件公用性非常强，UI组件一般不建议使用scoped</summary>

```
bad:
<style lang="scss">
  .topic-list{
    background:red;
  }
</style>
good:
<style lang="scss" scope>
  .topic-list{
     .el-input{
      background:red;
     }
   }
</style>
```
</details>

# 常见问题之Script区块

<details>
<summary>触发渲染数据操作写在一起，尽量减少触发渲染</summary>

```
bad: 
  export default {
    data () {
      let list = [{name:'name1'},{name:'name1'},{name:'name1'}]
      return {
        length: 0,
        list
      }
    },
    methods: {
      handleChange () {
        this.length = this.list.length // 触发渲染
        this.list.forEach(item => {
          item.name = 'name' + Math.random() // 触发渲染
        })
      }
    }
  }
  good: 
  export default {
    data () {
      let list = [{name:'name1'},{name:'name1'},{name:'name1'}]
      return {
        length: 0,
        list
      }
    },
    methods: {
      handleChange () {
        let list = Object.assign([], this.list)
        list.forEach(item => {
          item.name = 'name' + Math.random()
        })
        // 触发渲染
        this.length = list.length 
        this.list = list
      }
    }
  }
```
</details>


<details>
<summary>要尽可能使用ES5+去写来提高代码的简洁和可维护性</summary>

```
1. 数组循环尽量不要用for i,多用forEach,map,for of
2. 字符串拼接多用反单引号和'${}'
3. 使用解构和箭头函数

更多查看：https://github.com/yuche/javascript
```
</details>

<details>
<summary>对文件引而不用，造成文件体积变大</summary>

```
bad: 
<template>
  <!--template里ECarouselItem,ECarousel组件没有用到-->
  <div><div>
</template>
<script>
  import {ECarousel, ECarouselItem} from 'e-ui/carousel'
  export default {
    components: {
      ECarousel,
      ECarouselItem
    }
  }
</script>
```
</details>

<details>
<summary>慎用import或者require方式引入图片，多用静态目录下的根引入方式</summary>

#### 注意：import或者require方式引入过多会损耗webpack构建速度,[webpack图片构建详情](https://zh.nuxtjs.org/guide/assets)

```
bad: 
<template>
  <img src="~assets/image.png">
</template>

good:
<template>
  <!--放入static目录即可-->
  <img src="/image.png">
</template>
```
</details>

<details>
<summary>像弹框，依赖其他库等要多用按需加载，以减少打包后单个文件体积</summary>

```
bad:
<script>
  import QRCode from 'qrcodejs2'
  export default {
    mounted () {
      this.$$qrcode = new QRCode(this.$el, {
        ...this.$props
      })
    }
  }
</script>

good:
<script>
  export default {
    mounted () {
      require.ensure([], (r) => { // 异步加载
        let QRCode = require('qrcodejs2')
        this.$$qrcode = new QRCode(this.$el, {
          ...this.$props
        })
      })
    }
  }
</script>
```
</details>

<details>
<summary>非渲染属性要与data,computed,props用$$或者$_区分开来</summary>

```
bad:
<script>
  export default {
    data () {
      return {
        message: 'hello world' // 渲染属性
      }
    },
    mounted () {
      this.isReady = true // 非渲染属性
    }
  }
</script>

good:
<script>
  export default {
    data () {
      return {
        message: 'hello world' // 渲染属性
      }
    },
    mounted () {
      this.$_isReady = true  // 非渲染属性
    }
  }
</script>
```
</details>

<details>
<summary>杜绝写空的data,computed,props,methods保持代码的干净</summary>

```
bad:
<script>
  export default {
    data () {
      return {}
    },
    methods: {
      handleClick () {
        console.log('handleClick')
      }
    }
  }
</script>

good:
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
  <summary>import引入文件名没有区分大小写问题</summary>
  
```  
  由于windows环境不区分大小写，而linux却区分大小写。这样就导致在开发，测试，生产环境webpack构建打包失败
```
</details>
<details>
<summary>组件拆分颗粒问题，保持更优的合理度，单一职责，可维护性，避免文件过大</summary>
</details>

