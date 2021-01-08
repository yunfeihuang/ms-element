<template>
  <div>
    <!--创建表单弹框-->
    <create-form-popup title="创建"></create-form-popup>
    <!--编辑表单弹框-->
    <update-form-popup title="编辑"></update-form-popup>
    <!--详情弹框-->
    <detail-popup title="详情"></detail-popup>
    <!--自定义弹框-->
    <list-popup title="列表" size="96%" :drawer="{direction: 'ttb'}"></list-popup>
    <!--自定义弹框-->
    <coustom-popup></coustom-popup>
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
        <!--ElForm组件的v-bind="getFormProps()"传递props和@submit.native.prevent="handleSubmit"注册事件是必须的-->
        <el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
          <el-form-item label="姓名">
            <el-input v-model.trim="query.keyword" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" placeholder="请选择" multiple collapse-tags clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              type="datetime"
              value-format="timestamp"
              v-model="query.datetime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              type="daterange"
              value-format="timestamp"
              :value="query.start_time ? [query.start_time, query.end_time] : null"
              @input="handleDateRangeInput($event, ['start_time', 'end_time'])">
            </el-date-picker>
          </el-form-item>
          <!--native-type="submit"是修改button type属性为submit-->
          <el-button native-type="submit" size="small">搜索</el-button>
          <el-button size="small" @click="handleHighToggle">高级搜索</el-button>
          <!--
          <el-button size="small" @click="handleReset">重置</el-button>
          -->
          <el-button @click="pushOpen('create')" size="small">创建</el-button>
        </el-form>
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
            <el-button type="text" @click="pushOpen('update',scope.row)">编辑</el-button>
            <el-button type="text" @click="pushOpen('detail',scope.row)">详情</el-button>
            <el-button type="text" @click="pushOpen('list',{keyword: 'test'})">列表弹框</el-button>
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
const Form = () => import('./components/Form')
const CreateFormPopup = $mixins.popupManager.$('create', Form)
const UpdateFormPopup = $mixins.popupManager.$('update', Form)
const DetailPopup = $mixins.popupManager.$('detail', () => import('./components/Detail'))
const CoustomPopup = $mixins.popupManager.$('coustom', () => import('./components/Detail'), {
  title: (h, context) => {
    return (<div class="tc">coustom title area</div>)
  },
  footer: (h, context) => {
    return (<div class="tc">coustom footer area</div>)
  }
})
const ListPopup = $mixins.popupManager.$('list', () => import('./components/List'))

export default {
  mixins: [
    $mixins.pageList,
    $mixins.popupManager
  ],
  components: {
    CreateFormPopup,
    UpdateFormPopup,
    DetailPopup,
    ListPopup,
    CoustomPopup
  },
  data () {
    return {
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
        url: '/list'
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
