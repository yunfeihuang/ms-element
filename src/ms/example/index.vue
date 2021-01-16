<template>
  <div>
    <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
    <e-page-list-layout>
      <!--
      <el-breadcrumb slot="breadcrumb">
        <el-breadcrumb-item>XXX管理</el-breadcrumb-item>
        <el-breadcrumb-item>XXX列表</el-breadcrumb-item>
      </el-breadcrumb>
      -->
      <template slot="search">
        <el-tabs v-model="query.active" type="card" @tab-click="handleTab">
          <el-tab-pane label="黄金" name="first"></el-tab-pane>
          <el-tab-pane label="白金" name="second"></el-tab-pane>
          <el-tab-pane label="白银" name="third"></el-tab-pane>
        </el-tabs>
        <query-form :model="query" :items="formItems" v-bind="getFormProps()" @submit="handleSubmit">
          <el-date-picker
            slot="date"
            type="daterange"
            value-format="timestamp">
          </el-date-picker>
          <el-button size="small" @click="handleCreate()">创建</el-button>
        </query-form>
      </template>
      <template slot="search-high">
        <el-col v-bind="getColProps()">
          <el-form-item label="姓名">
            <el-input v-model.trim="highQuery.keyword" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="getColProps()">
          <el-form-item label="状态">
            <el-select v-model="highQuery.status" placeholder="请选择" multiple collapse-tags>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="getColProps()">
          <el-form-item label="工作时间">
            <el-date-picker
              type="daterange"
              value-format="timestamp"
              :value="highQuery.start_time ? [highQuery.start_time, highQuery.end_time] : null"
              @input="handleDateRangeInput($event, ['start_time', 'end_time'], 'highQuery')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-bind="getColProps()">
          <el-form-item label="邮箱">
            <el-input v-model.trim="highQuery.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="getColProps()">
          <el-form-item label="年龄">
            <el-input v-model.trim="highQuery.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="getColProps()">
          <el-form-item label="地址">
            <el-input v-model.trim="highQuery.address" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-col>
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
            <el-button type="text" @click="pushOpen('coustom',scope.row)">自定义弹框</el-button>
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
    </e-page-list-layout>
  </div>
</template>

<script>
import QueryForm from '@/ms/components/query-form'
const Form = () => import('./components/Form')
console.log('dsafdsa', ms)
export default {
  components: {
    QueryForm
  },
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
      highQuery: this.getHighQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        keyword: '',
        status: [],
        start: null,
        end: null,
        start_time: '',
        end_time: ''
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
      this.$axios({
        url: '/user'
      }).then(res => {
        this.pageData = res.data
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
        title: '详情'
      })
    },
    handleList () {
      ms.navigator.push(this, () => import('./components/List'), {
        title: '列表',
        direction: 'ttb',
        size: '80%'
      })
    },
    handleOpen (row) {
      this.$open('弹窗列表', this.$route.fullPath)
      // this.$open('弹窗表单', import('./components/Detail'))
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
