<template>
  <div class="ms-designer">
    <ms-page-list-layout>
      <el-form v-bind="getFormProps({class: ['form-search','ms-search-form']})" slot="search">
        <div class="ms-designer--pagelist-tabs ms-search-form--prepend">
          <el-tabs
            type="card"
            editable
            :value="designer.tabs.option[0] ? designer.tabs.option[0].name : ''"
            @tab-add="handleTabsForm()"
            @tab-click="handleTabsForm"
            @tab-remove="handleTabRemove">
            <el-tab-pane v-for="(item,index) in designer.tabs.option" :key="index" v-bind="item">
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="ms-designer--pagelist-search">
          <el-tooltip placement="top" v-for="(item,index) in designer.search.option" :key="index">
            <el-button type="text" slot="content"  @click="handleSearchRemove(item)">删除</el-button>
            <el-form-item :label="item.label" @click.native="handleSearchForm(item)">
              <component :is="item.component" v-bind="item.props" readonly controls-position="right">
                <template v-if="item.component === 'el-select'">
                  <el-option v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-option>
                </template>
                <template v-else-if="item.component === 'el-checkbox-group'">
                  <el-checkbox v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-checkbox>
                </template>
                <template v-else-if="item.component === 'el-radio-group'">
                  <el-radio v-for="(item,index) in item.slots" :key="index" v-bind="item"></el-radio>
                </template>
                <template v-else-if="item.component === 'el-upload'">
                  <el-button>上传</el-button>
                </template>
              </component>
            </el-form-item>
          </el-tooltip>
          <el-form-item>
            <el-tooltip content="创建搜索项" placement="top">
              <el-button style="min-width:0" icon="el-icon-plus" @click="handleSearchForm()"></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item v-if="designer.form.option.some(item => item.action.includes('create'))">
            <el-button @click="handleForm()">创建</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="ms-designer--pagelist-table" slot="table">
        <el-table
          v-bind="getTableProps()"
          v-on="getTableListeners()"
          :data="designer.setting.table.data"
          @header-click="handleTableColumnForm"
          @row-click="handleTableDataForm">
          <el-table-column
            v-if="designer.setting.table.batch.some(item => ['import', 'export', 'delete', 'update'].includes(item.type))"
            type="selection"
            width="58">
          </el-table-column>
          <el-table-column
            v-if="designer.setting.table.serialNumber"
            v-bind="getIndexColumnProps()">
          </el-table-column>
          <el-table-column v-for="(item,index) in designer.table.column" :key="index" v-bind="item">
            <template v-slot:header="scope">
              <el-tooltip placement="top">
                <el-button type="text" slot="content" @click="handleTableColumnRemove(scope.column)">删除</el-button>
                <span>{{scope.column.label}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="designer.setting.delete || designer.form.option.some(item => item.action.includes('update'))">
            <template v-slot="scope">
              <el-button type="text" v-if="designer.form.option.some(item => item.action.includes('update'))" @click.stop="handleForm('update')">编辑</el-button>
              <el-button type="text" v-if="designer.setting.delete">删除</el-button>
              <el-button type="text" @click.stop="handleClear(scope.row)">清理模拟数据</el-button>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot="header">
              <el-tooltip content="创建表格列" placement="top">
                <el-button size="mini" icon="el-icon-plus" @click.stop="handleTableColumnForm()"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <div v-if="designer.table.column.length" slot="append" style="text-align:center;margin:10px;">
            <el-button size="small" @click="handleTableDataForm()">添加模拟数据</el-button>
          </div>
        </el-table>
      </div>
      <template slot="action">
        <el-tooltip placement="top" v-for="(item,index) in designer.setting.table.batch" :key="index">
          <el-button type="text" slot="content"  @click="handleBatchRemove(item)">删除</el-button>
          <template>
            <el-button v-if="item.type === 'import'" size="small" @click="handleBatchForm(item,index)">{{item.label}}</el-button>
            <el-button v-else-if="item.type === 'export'" size="small" @click="handleBatchForm(item,index)">{{item.label}}</el-button>
            <el-button v-else-if="item.type === 'delete'" size="small" @click="handleBatchForm(item,index)">{{item.label}}</el-button>
            <el-button v-else-if="item.type === 'update'" size="small" @click="handleBatchForm(item,index)">{{item.label}}</el-button>
          </template>
        </el-tooltip>
        <el-tooltip content="创建批量操作项" placement="top">
          <el-button size="small" icon="el-icon-plus" @click="handleBatchForm()"></el-button>
        </el-tooltip>
      </template>
    </ms-page-list-layout>
  </div>
</template>

<script>
import axios from 'axios'
const Form = () => import('./components/Form')
const SearchForm = () => import('./components/SearchForm')
const TabsForm = () => import('./components/TabsForm')
const SettingForm = () => import('./components/SettingForm')
const TableColumnForm = () => import('./components/TableColumnForm')
const TableDataForm = () => import('./components/TableDataForm')
const BatchForm = () => import('./components/BatchForm')

const designer = {
  setting: {
    dir: '',
    route: {
      path: '',
      meta: {
        group: '',
        title: ''
      }
    },
    restfulApi: '',
    idProp: 'id',
    table: {
      data: [],
      batch: [],
      serialNumber: false
    }
  },
  tabs: {
    prop: '',
    option: [
      /*
      {
        label: '全部',
        name: 'tab1'
      }
      */
    ]
  },
  search: {
    option: [
      /*
      {
        component: 'el-input',
        label: '关键字',
        prop: 'aa',
        props: {}
      }
      */
    ]
  },
  form: {
    option: []
  },
  table: {
    column: [
      /*
      {
        label: '列一',
        prop: 'aa'
      },
      {
        label: '操作',
        actions: [
          {
            name: 'update',
            label: '编辑'
          },
          {
            name: 'delete',
            label: '删除'
          }
        ]
      }
      */
    ]
  }
}

export default {
  name: 'Designer',
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      pageData: {
        data: designer.setting.data,
        count: 1000
      },
      query: this.getQuery({}),
      designer: localStorage.getItem('ms-designer') ? JSON.parse(localStorage.getItem('ms-designer')) : designer
    }
  },
  watch: {
    designer: {
      handler (value) {
        localStorage.setItem('ms-designer', JSON.stringify(value))
      },
      deep: true
    }
  },
  mounted () {
    this.$root.$on('setting', this.handleSettingForm)
    this.$root.$on('create-column', this.handleTableColumnForm)
    this.$root.$on('import', this.handleImport)
  },
  beforeDestroy () {
    this.$root.$off('setting', this.handleSettingForm)
    this.$root.$off('create-column', this.handleTableColumnForm)
    this.$root.$off('import', this.handleImport)
  },
  methods: {
    handleSettingForm () {
      let designer = this.designer
      ms.navigator.push(this, SettingForm, {
        title: '设置',
        params: {
          ...designer.setting
        },
        promiseSubmit (form) {
          designer.setting = form
          return axios({
            url: '/designer',
            method: 'POST',
            data: {
              designer
            }
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '生成成功'
              })
              // localStorage.removeItem('ms-designer')
              this.$router.push({
                path: designer.setting.route.path
              })
            }
          })
        }
      })
    },
    handleTabsForm (tab) {
      let designer = this.designer
      ms.navigator.push(this, TabsForm, {
        title: tab ? '编辑' : '创建',
        params: tab ? {
          label: tab.label,
          name: tab.name,
          prop: designer.tabs.prop
        } : {prop: designer.tabs.prop},
        promiseSubmit (form) {
          let { prop, ...other } = form
          designer.tabs.prop = form.prop
          let result = designer.tabs.option.find(item => item.name === form.name)
          if (result) {
            Object.assign(result, other)
          } else {
            designer.tabs.option.push({
              ...other
            })
          }
          return Promise.resolve(form)
        }
      })
    },
    handleTabRemove (name) {
      this.$confirm('确认删除该选项卡?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.tabs.option = this.designer.tabs.option.filter(item => item.name !== name)
      })
    },
    handleSearchForm (params) {
      let designer = this.designer
      ms.navigator.push(this, SearchForm, {
        title: params ? '编辑' : '创建',
        params,
        promiseSubmit (form) {
          if (params) {
            Object.assign(params, form)
          } else {
            designer.search.option.push(form)
          }
          return Promise.resolve(form)
        }
      })
    },
    handleSearchRemove ({prop}) {
      this.$confirm('确认删除该搜索项?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.search.option = this.designer.search.option.filter(item => item.prop !== prop)
      })
    },
    handleTableColumnForm (column, event) {
      let designer = this.designer
      let action = []
      if (column) {
        if (designer.form.option.some(item => item.prop === column.property && item.action.includes('create'))) {
          action.push('create')
        }
        if (designer.form.option.some(item => item.prop === column.property && item.action.includes('update'))) {
          action.push('update')
        }
        if (designer.search.option.some(item => item.prop === column.property)) {
          action.push('search')
        }
      }
      ms.navigator.push(this, TableColumnForm, {
        title: column ? '编辑' : '创建',
        params: column ? {
          label: column.label,
          prop: column.property,
          action
        } : undefined,
        promiseSubmit (form) {
          let {action, ...other} = form
          let result = designer.table.column.find(item => item.prop === form.prop)
          if (result) {
            Object.assign(result, other)
          } else {
            designer.table.column.push(other)
          }
          if (form.action.includes('search')) {
            let result = designer.search.option.find(item => item.prop === form.prop)
            if (result) {
              Object.assign(result, other)
            } else {
              designer.search.option.push({
                ...other,
                component: 'el-input'
              })
            }
          }
          if (action.includes('create') || action.includes('update')) {
            let result = designer.form.option.find(item => item.prop === form.prop)
            if (result) {
              Object.assign(result, form)
            } else {
              designer.form.option.push({
                ...form,
                component: 'el-input'
              })
            }
          }
          return Promise.resolve(form)
        }
      })
    },
    handleTableColumnRemove ({property}) {
      this.$confirm('确认删除该列?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.table.column = this.designer.table.column.filter(item => item.prop !== property)
      })
    },
    handleForm (type = 'create') {
      let designer = this.designer
      const params = designer.form.option.filter(item => item.action.includes(type))
      ms.navigator.push(this, Form, {
        title: type === 'create' ? '创建' : '编辑',
        params,
        promiseSubmit (form) {
          designer.form.option = form
          return Promise.resolve(form)
        }
      })
    },
    handleBatchForm (params, index) {
      let designer = this.designer
      ms.navigator.push(this, BatchForm, {
        title: !params ? '创建' : '编辑',
        params,
        promiseSubmit (form) {
          if (params) {
            Object.assign(params, form)
          } else {
            designer.setting.table.batch.push(form)
          }
          return Promise.resolve(form)
        }
      })
    },
    handleBatchRemove (value) {
      this.$confirm('确认删除批量操作项?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.setting.table.batch = this.designer.setting.table.batch.filter(item => item !== value)
      })
    },
    handleTableDataForm (row) {
      const title = !row ? '创建' : '编辑'
      let designer = this.designer
      let _row = {}
      if (!row) {
        designer.table.column.forEach(item => {
          _row[item.prop] = ''
        })
        _row[designer.setting.idProp] = Math.random().toString(36).substr(2)
      } else {
        _row = row
      }
      ms.navigator.push(this, TableDataForm, {
        title,
        params: {
          column: designer.table.column,
          row: {
            ..._row
          }
        },
        promiseSubmit (form) {
          if (row) {
            Object.assign(row, form)
          } else {
            designer.setting.table.data.push(form)
          }
          return Promise.resolve(form)
        }
      })
    },
    handleClear (row) {
      this.$confirm('确认删除模拟数据?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.setting.table.data = this.designer.setting.table.data.filter(item => item != row)
      })
    },
    handleImport () {
      ms.navigator.push(this, () => import('./components/ImportForm'), {
        title: '导入',
        promiseSubmit (form) {
          const config = JSON.parse(form.json)
          if (config) {
            this.config = config
          }
          return Promise.resolve(form)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ {
    .el-tabs__header{
      min-height:34px;
    }
    .el-tabs__new-tab{
      margin-top:5px;
    }
  }
  .ms-designer-snippet{
    outline: 1px dashed #ccc;
    outline-offset: 4px;
  }
</style>
