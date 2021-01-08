# DropdownGroup 输入框分组
<el-form inline>
  <e-dropdown-group
    v-model="queryKey1"
    :model="query"
    :options="[
      {value: 'reg_no', label: '注册号'},
      {value: 'name', label: '商标名称'}
    ]">
    <template slot-scope="scope">
      <el-input :placeholder="`请输入${scope.label}`" v-model.trim="query[scope.value]"></el-input>
    </template>
  </e-dropdown-group>
</el-form>

```html
<template>
  <el-form inline>
    <e-dropdown-group
      v-model="queryKey1"
      :model="query"
      :options="[
        {value: 'reg_no', label: '注册号'},
        {value: 'name', label: '商标名称'}
      ]">
      <template slot-scope="scope">
        <el-input :placeholder="`请输入${scope.label}`" v-model.trim="query[scope.value]"></el-input>
      </template>
    </e-dropdown-group>
  </el-form>
</template>
<script>
  export default {
    data () {
      return {
        queryKey1: 'reg_no',
        query: {
          reg_no: '',
          name: ''
        }
      }
    }
  }
</script>
```


### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| value     | 当前dropdown值   | -  |   -       |    -    |
| options     | dropdown选项数组   | -  |   -       |    -    |
| model     |  绑定数据对象，用于切换dropdown时重置此对象的值  | -  |   -       |    -    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| - | - |