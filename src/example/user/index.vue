<template>
  <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form :option="option" @submit="handleSubmit">
        <el-tabs slot="prepend" v-model="query.active" type="card" @tab-click="handleTab">
          <el-tab-pane label="黄金" name="first"></el-tab-pane>
          <el-tab-pane label="白金" name="second"></el-tab-pane>
          <el-tab-pane label="白银" name="third"></el-tab-pane>
        </el-tabs>
        <input
          slot="custom"
          v-model="query.custom"/>
        <el-button size="small" @click="handleCreate()">创建</el-button>
      </ms-search-form>
    </template>
    <!--v-bind="getTableProps()"是必须的-->
    <el-table slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      <el-table-column
        type="selection"
        width="58">
      </el-table-column>
      <el-table-column
        v-bind="getIndexColumnProps()">
      </el-table-column>
      <el-table-column
        label="头像">
        <template v-slot="scope">
          <img src="/static/images/img_qr.jpg" v-preview style="width:30px;height:30px">
        </template>
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
      <el-table-column
        label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          <el-dropdown trigger="click">
            <el-button type="text" style="margin-left: 10px;">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleLargeDetail(scope.row)">详情大弹窗</el-dropdown-item>
              <el-dropdown-item @click.native="handleCustom(scope.row)">自定义弹框</el-dropdown-item>
              <el-dropdown-item @click.native="handleOpen">iframe弹框</el-dropdown-item>
              <el-dropdown-item @click.native="handleOpenComponent">引入组件弹框</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push({path: $route.path + '/detail', query: scope.row})">页面式详情</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <template slot="action">
      <el-button size="small">导入</el-button>
      <el-button :disabled="multipleSelectionAll.length==0" size="small" @click="handleExport">导出</el-button>
    </template>
  </ms-page-list-layout>
</template>

<script>
const Form = () => import('./components/Form')
const Detail = () => import('./components/Detail')
const List = () => import('./components/List')

export default {
  name: 'user',
  mixins: [
    ms.mixins.pageList
  ],
  props: {
    restful: {
      default () {
        return ms.restful('/user')
      }
    }
  },
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
        },
        {
          prop: ['startDate', 'endDate'],
          component: 'el-date-picker',
          label: '日期范围',
          props: {
            type: 'daterange',
            valueFormat: 'YYYY-MM-dd'
          },
          value: ['', ''],
          hight: true
        },
        {
          prop: 'custom',
          label: '自定义',
          hight: true
        }
      ],
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        active: 'first',
        start_time: '',
        end_time: '',
        ...this.$route.query
      }),
      multipleSelectionProp: 'id' // 设置返回的数据列表唯一标识属性名
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      return this.$axios({
        url: '/user'
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
        mixins: [
          ms.mixins.form
        ],
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
            return new Promise((resolve, reject) => {
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
        titleSlot: {
          template: '<div>custom title</div>'
        },
        done (cb) {
          // ms.navigator.pop(self)
          cb()
          self.beforeFetch()
        },
        promiseSubmit (data) {
          console.log('promiseSubmit', data)
          return new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
          })
        }
      })
    },
    handleOpen (row) {
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
    handleExport (type, event) {
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
