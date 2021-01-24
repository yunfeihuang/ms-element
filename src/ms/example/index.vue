<template>
  <div>
    <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
    <ms-page-list-layout>
      <template slot="search">
        <el-tabs v-model="query.active" type="card" @tab-click="handleTab">
          <el-tab-pane label="黄金" name="first"></el-tab-pane>
          <el-tab-pane label="白金" name="second"></el-tab-pane>
          <el-tab-pane label="白银" name="third"></el-tab-pane>
        </el-tabs>
        <ms-query-form :model="query" :items="formItems" v-bind="getFormProps()" @submit="handleSubmit">
          <el-date-picker
            slot="date"
            type="daterange"
            value-format="timestamp">
          </el-date-picker>
          <el-button size="small" @click="handleCreate()">创建</el-button>
        </ms-query-form>
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
          label="姓名">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          label="年龄">
          <template slot-scope="scope">
            {{scope.row.age}}
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱">
          <template slot-scope="scope">
            {{scope.row.email}}
          </template>
        </el-table-column>
        <el-table-column
          width="60"
          label="状态">
          <template slot-scope="scope">
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
          width="450"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleCreate(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button type="text" @click="handleList">列表弹框</el-button>
            <el-button type="text" @click="handleCustom(scope.row)">自定义弹框</el-button>
            <el-button type="text" @click="handleOpen">iframe弹框</el-button>
            <el-button type="text" @click="$router.push({path: '/example/detail', query: scope.row})">页面式详情</el-button>
            <el-button type="text" @click="handleDelete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template slot="action">
        <el-button size="small">导入</el-button>
        <el-button :disabled="multipleSelectionAll.length==0" size="small" @click="handleExport">导出</el-button>
      </template>
    </ms-page-list-layout>
  </div>
</template>

<script>
const Form = () => import('./components/Form')

export default {
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
      formItems: [
        {
          prop: 'keyword',
          label: '关键字',
          props: {
            placeholder: '请输入姓名或手机搜索'
          }
        },
        {
          prop: 'status',
          label: '用户状态',
          options: [
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
          label: '日期范围'
        }
      ],
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        active: 'first',
        keyword: '',
        status: [],
        start: null,
        end: null,
        datetime: null,
        start_time: '',
        end_time: '',
        ...this.$route.query
      }),
      multipleSelectionProp: 'id', // 设置返回的数据列表唯一标识属性名
      options: [{
        value: '启用',
        label: '启用'
      }, {
        value: '禁用',
        label: '禁用'
      }],
      pageData: {
        count: 0,
        data: []
      }
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
      ms.navigator.push(this, Form, {params, title: params ? '编辑' : '创建'})
    },
    handleDetail (params) {
      ms.navigator.push(this, () => import('./components/Detail'), {
        params,
        title: '详情',
        size: 'large'
      })
    },
    handleCustom (params) {
      ms.navigator.push(this, {
        mixins: [
          ms.mixins.form
        ],
        data () {
          return {
            form: {
              pass: true,
              value: ''
            }
          }
        },
        metbods: {
          fetch () {
            return new Promise((resolve, reject) => {
              setTimeout(resolve(this.params), 2000)
            })
          },
          submit () { // 表单校验通过后调用的方法，一般是请求后台接口的方法
            return new Promise((resolve, reject) => {
              setTimeout(resolve, 1000)
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
      }, {
        params,
        title: '详情',
        titleSlot: {
          template: '<div>custom title</div>'
        },
        footerSlot: {
          inject: [
            'msDrawer'
          ],
          template: `
            <div>
              <el-button size="small" type="primary" @click="msDrawer.handleSubmit">通过</el-button>
              <el-button size="small" type="danger">拒绝</el-button>
            </div>
          `
        }
      })
    },
    handleList () {
      ms.navigator.push(this, () => import('./components/List'), {
        title: '列表',
        direction: 'ttb',
        size: '100vh',
        params: {
          keyword: '黄运飞'
        }
      })
    },
    handleOpen (row) {
      /*
      ms.navigator.open(this, this.$route.fullPath, {
        title: '弹窗列表'
      })
      */
      ms.navigator.preview({
        src: [
          '/static/images/img_qr.jpg'
        ]
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
