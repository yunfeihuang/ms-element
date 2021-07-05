# pageList分页列表
<div>
  <!--ElForm组件的v-bind="getFormProps()"传递props和@submit.native.prevent="handleSubmit"注册事件是必须的-->
  <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
    <el-form-item label="用户名">
      <el-input v-model.trim="query.keyword" placeholder="请输入关键字"></el-input>
    </el-form-item>
    <!--native-type="submit"是修改button type属性为submit-->
    <el-button native-type="submit" size="small">搜索</el-button>
  </el-form>
  <!--v-bind="getTableProps()"是必须的-->
  <el-table
    v-bind="getTableProps()"
    v-on="getTableListeners()"
    :data="pageData.data">
    <el-table-column
      label="序号">
      <template v-slot="scope">
        {{scope.$index+1}}
      </template>
    </el-table-column>
    <el-table-column
      sortable="custom"
      prop="date"
      label="日期">
    </el-table-column>
    <el-table-column
      label="操作"
      :width="150">
      <template v-slot="scope">
        <el-button type="text" @click="$router.push({path: '/compensation/detail'})">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-bind="getPaginationProps(pageData)"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange">
  </el-pagination>
</div>

```html
 <template>
  <div>
    <!--ElForm组件的v-bind="getFormProps()"传递props和@submit.native.prevent="handleSubmit"注册事件是必须的-->
    <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
      <el-form-item label="用户名">
        <el-input v-model.trim="query.keyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <!--native-type="submit"是修改button type属性为submit-->
      <el-button native-type="submit" size="small">搜索</el-button>
    </el-form>
    <!--v-bind="getTableProps()"是必须的-->
    <el-table
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      <el-table-column
        label="序号">
        <template v-slot="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        label="操作"
        :width="150">
        <template v-slot="scope">
          <el-button type="text" @click="$router.push({path: '/compensation/detail'})">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-bind="getPaginationProps(pageData)"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  mixins: [$mixins.pageList], // 必须引入pageList mixins
  data () {
    return {
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        keyword: '',
        ...this.$route.query
      }),
      pageData: { // 必须以此命名
        count: 1000,
        data: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      console.log(query)
    }
  }
}
</script>
```
### 使用PageListLayout结构布局, template块有变动，其他不变
```
<template>
  <e-page-list-layout>
    <!--ElForm组件的v-bind="getFormProps()"传递props和@submit.native.prevent="handleSubmit"注册事件是必须的-->
    <el-form slot="search" v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
      <el-form-item label="用户名">
        <el-input v-model.trim="query.keyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <!--native-type="submit"是修改button type属性为submit-->
      <el-button native-type="submit" size="small">搜索</el-button>
    </el-form>
    <!--v-bind="getTableProps()"是必须的-->
    <el-table
      slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      <el-table-column
        label="序号">
        <template v-slot="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        label="操作"
        :width="150">
        <template v-slot="scope">
          <el-button type="text" @click="$router.push({path: '/compensation/detail'})">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </e-page-list-layout>
</template>
```
### Props
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |------------- |--------- |
| history     | 是否产生浏览器历史记录   | boolean  |   -       |    true    |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------|--------|---------|
| - | - | - |

### Slots
| 名称 | 说明 | 
|---------|--------|
| - | - |
