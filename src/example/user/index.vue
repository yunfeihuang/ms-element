<template>
  <ms-page-list-layout>
    <template #search>
      <ms-search-form
        v-bind="getFormProps()"
        @submit.prevent="handleSubmit"
        @create="handleCreate()">
        <template #prepend>
          <el-tabs v-model="query.active" type="card" @tab-click="handleTab">
            <el-tab-pane label="黄金" name="first"></el-tab-pane>
            <el-tab-pane label="白金" name="second"></el-tab-pane>
            <el-tab-pane label="白银" name="third"></el-tab-pane>
          </el-tabs>
        </template>
        <template v-for="(item,index) in option" :key="index" v-slot:[`${item.prop}-slot`]>
          <el-form-item :label="item.label" :prop="item.prop">
            <component :is="item.component || 'el-input'" v-model="query[item.prop]" clearable></component>
          </el-form-item>
        </template>
      </ms-search-form>
    </template>
    <template #table>
      <el-table
        v-bind="getTableProps()"
        v-on="getTableListeners()"
        v-loading="loading"
        :data="response && response.data ? response.data : []">
        <el-table-column
          v-bind="getSelectionProps()">
        </el-table-column>
        <el-table-column
          v-bind="getIndexColumnProps()">
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'avatar' && item.show) : true"
          prop="avatar"
          label="头像">
          <template v-slot>
            avatar
          </template>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'name' && item.show) : true"
          sortable
          prop="name"
          label="姓名">
          <template v-slot="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'age' && item.show) : true"
          prop="age"
          width="60"
          label="年龄">
          <template v-slot="scope">
            {{scope.row.age}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'email' && item.show) : true"
          prop="email"
          label="邮箱">
          <template v-slot="scope">
            {{scope.row.email}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'status' && item.show) : true"
          prop="status"
          width="60"
          label="状态">
          <template v-slot="scope">
            {{scope.row.state}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'address' && item.show) : true"
          prop="address"
          label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          v-if="column && column.length ? column.some(item => item.prop == 'date' && item.show) : true"
          prop="date"
          label="创建日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot:header>
            操作 <el-button type="text" @click="handleColumnSetting"><i class="el-icon-s-operation"></i></el-button>
          </template>
          <template v-slot="scope">
            <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-dropdown trigger="click">
              <el-button type="text" style="margin-left: 10px;">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLargeDetail(scope.row)">详情大弹窗</el-dropdown-item>
                  <!--
                  <el-dropdown-item @click="handleCustom(scope.row)">自定义弹框</el-dropdown-item>
                  <el-dropdown-item @click="handleOpen">iframe弹框</el-dropdown-item>
                  -->
                  <el-dropdown-item @click="handleOpenComponent">引入组件弹框</el-dropdown-item>
                  <el-dropdown-item @click="$router.push({path: $route.path + '/detail', query: scope.row})">页面式详情</el-dropdown-item>
                  <el-dropdown-item @click="handleDelete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #action>
      <el-button size="small">导入</el-button>
      <el-button size="small" @click="handleExport">导出</el-button>
    </template>
  </ms-page-list-layout>
</template>

<script>
import ms from 'ms-element/ms'
const Form = () => import('./components/Form')
const Detail = () => import('./components/Detail')
const List = () => import('./components/List')
// const api = ms.restful('/user')

export default {
  name: 'user',
  mixins: [ms.mixins.pageList],
  data () {
    return {
      option: [
        {
          prop: 'keyword',
          label: '关键字',
          component: 'el-input',
          props: {
            placeholder: '请输入姓名或手机搜索'
          }
        },
        {
          prop: 'status',
          label: '用户状态',
          component: 'el-select',
          option: [
            {
              label: '启用',
              value: '1'
            },
            {
              label: '禁用',
              value: '2'
            }
          ]
        },
        {
          prop: 'date',
          label: '日期',
          component: 'el-date-picker',
          props: {
            valueFormat: 'YYYY-MM-dd'
          }
        }
      ],
      query: this.createQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        active: 'first',
        start_time: '',
        end_time: '',
        ...this.$route.query
      }),
      column: [
        {
          prop: 'avatar',
          label: '头像',
          show: true
        },
        {
          prop: 'name',
          label: '姓名',
          show: true
        },
        {
          prop: 'age',
          label: '年龄',
          show: true
        },
        {
          prop: 'email',
          label: '邮箱',
          show: true
        },
        {
          prop: 'status',
          label: '状态',
          show: true
        },
        {
          prop: 'date',
          label: '创建时间',
          show: true
        }
      ]
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
            id: (query.page * query.rows + i).toString(),
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
    handleDelete () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    handleCreate (params) {
      console.log(this.response.data.find)
      ms.navigator.push(this, Form, {
        params,
        title: params ? '编辑' : '创建',
        done: cb => {
          cb()
          this.refresh()
        }
      })
    },
    handleDetail (params) {
      ms.navigator.push(this, Detail, {
        params,
        title: '详情弹窗'
      })
    },
    handleLargeDetail (params) {
      ms.navigator.push(this, Detail, {
        params,
        title: '详情大弹窗',
        size: 'large'
      })
    },
    handleCustom (params) {
      const Component = {
        mixins: [ms.mixins.form],
        data () {
          return {
            form: {
              pass: false,
              value: ''
            }
          }
        },
        metbods: {
          fetch () {
            return new Promise((resolve) => {
              setTimeout(resolve(this.params), 2000)
            })
          }
        },
        template: `
          <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
            <el-form-item label="是否通过">
              <el-switch v-model="form.pass"/>
            </el-form-item>
            <el-form-item label="拒绝理由" prop="value" :rules="form.pass ? [] : [{required: true, message: '请输入拒绝理由'}]">
              <el-input v-model="form.value" type="textarea"/>
            </el-form-item>
          </el-form>
        `
      }
      let self = this
      ms.navigator.push(this, Component, {
        params,
        title: '详情',
        done (cb) {
          // ms.navigator.pop(self)
          cb()
          self.beforeFetch()
        },
        promiseSubmit (data) {
          console.log('promiseSubmit', data)
          return new Promise((resolve) => {
            setTimeout(resolve, 1000)
          })
        }
      })
    },
    handleOpen () {
      ms.navigator.push(this, this.$route.fullPath, {
        mode: 'dialog',
        title: 'iframe弹窗列表',
        size: 'large',
        params: {
          keyword: '张三'
        }
      })
    },
    handleOpenComponent () {
      ms.navigator.push(this, List, {
        mode: 'dialog',
        title: '引入组件弹窗列表',
        size: 'large',
        params: {
          keyword: '张三'
        }
      })
    },
    handleExport () {
      this.$confirm('确认执行此批量操作？', '提示', {
        type: 'warning'
      }).then(() => {
        let listId = this.multipleSelectionAll.map(item => item.product_id).join(',')
        console.log(listId)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
