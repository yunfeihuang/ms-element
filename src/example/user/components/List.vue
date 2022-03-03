<template>
  <ms-page-list-layout>
      <template #search>
        <!--ElForm组件的v-bind="getFormProps()"传递props和@submit.native.prevent="handleSubmit"注册事件是必须的-->
        <el-form v-bind="getFormProps()" @submit.prevent="handleSubmit">
          <el-form-item label="姓名">
            <el-input v-model.trim="query.keyword" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <!--native-type="submit"是修改button type属性为submit-->
            <el-button native-type="submit" size="small">搜索</el-button>
            <el-button size="small" @click="handleCreate()">创建</el-button>
           </el-form-item>
        </el-form>
      </template>
      <!--v-bind="getTableProps()"是必须的-->
      <template #table>
        <el-table
          v-bind="getTableProps()"
          v-on="getTableListeners()"
          :data="response ? response.data : []">
          <el-table-column
            v-bind="getSelectionProps()">
          </el-table-column>
          <el-table-column
            v-bind="getIndexColumnProps()">
          </el-table-column>
          <el-table-column
            label="姓名">
            <template v-slot="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            label="年龄">
            <template v-slot="scope">
              {{scope.row.age}}
            </template>
          </el-table-column>
          <el-table-column
            label="邮箱">
            <template v-slot="scope">
              {{scope.row.email}}
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            label="状态">
            <template v-slot="scope">
              {{scope.row.state}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            sortable="custom"
            prop="date"
            label="创建日期" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </template>
      <template #action>
        <el-button size="small">导入</el-button>
        <el-button :disabled="multipleSelectionAll.length==0" size="small">导出</el-button>
      </template>
    </ms-page-list-layout>
</template>

<script>
import ms from 'ms-element/ms'
const Form = () => import('./Form')
export default {
  mixins: [ms.mixins.pageList],
  props: {
    history: {
      default: false
    }
  },
  data () {
    return {
      query: this.createQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        keyword: '',
        status: [],
        start: null,
        end: null,
        datetime: null,
        start_time: '',
        end_time: '',
        ...this.params
      })
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      console.log('query', query)
      /*
      return this.$axios({
        url: '/user',
        params: query
      })
      */
      return new Promise((resolve) => {
        let data = []
        for (let i = 0; i < 20; i++) {
          data.push({
            id: Math.random().toString(),
            date: new Date().toLocaleString(),
            name: `张三${i}`,
            address: `上海市普陀区金沙江路${i}号`,
            age: Math.floor(Math.random() * 100),
            email: `${Math.floor(Math.random() * 100000000)}@qq.com`,
            state: '启用',
            url: '/static/images/img_qr.jpg',
            sex: '男',
            hoppy: ['足球', '篮球'],
            start_time: new Date().toLocaleString(),
            end_time: new Date().toLocaleString(),
            desc: '如果出现发生系统错误 1067 请把db目录下的mongod.lock文件删除后重新输入net start MongoDB启动服务即可'
          })
        }
        setTimeout(() => {
          resolve({
            total: 1000,
            data
          })
        }, 1000)
      })
    },
    handleCreate (params) {
      ms.navigator.push(this.$parent, Form, {
        params,
        title: params ? '编辑' : '创建',
        done: cb => {
          cb()
          this.refresh()
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
