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
            <el-button type="text" slot="content"  @click="handleSearchFormRemove(item)">删除</el-button>
            <el-form-item :label="item.label" @click.native="handleSearchForm(item)">
              <component :is="item.component || 'el-input'" v-bind="item.props" readonly/>
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
          :data="[{}]"
          @header-click="handleTableColumnForm">
          <el-table-column v-for="(item,index) in designer.table.column" :key="index" v-bind="item">
            <template v-slot:header="scope">
              <el-tooltip placement="top">
                <el-button type="text" slot="content" @click="handleTableColumnFormRemove(scope.column)">删除</el-button>
                <span>{{scope.column.label}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="designer.page.delete || designer.form.option.some(item => item.action.includes('update'))">
            <template v-slot="scope">
              <el-button type="text" v-if="designer.form.option.some(item => item.action.includes('update'))" @click="handleForm('update')">编辑</el-button>
              <el-button type="text" v-if="designer.page.delete">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot="header">
              <el-tooltip content="表格设置" placement="top">
                <el-button size="mini" icon="el-icon-setting" @click.stop="handleTableForm()"></el-button>
              </el-tooltip>
              <el-tooltip content="创建表格列" placement="top">
                <el-button size="mini" icon="el-icon-plus" @click.stop="handleTableColumnForm()"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="action" v-if="designer.page.export || designer.page.import">
        <el-button size="small" v-if="designer.page.import">导入</el-button>
        <el-button size="small" v-if="designer.page.export" @click="handleExport">导出</el-button>
        <el-button size="small" v-if="designer.page.batchDelete" @click="handleExport">删除</el-button>
      </template>
    </ms-page-list-layout>
  </div>
</template>

<script>
import axios from 'axios'
const Form = () => import('./components/Form')
const SearchForm = () => import('./components/SearchForm')
const TabsForm = () => import('./components/TabsForm')
const TableForm = () => import('./components/TableForm')
const TableColumnForm = () => import('./components/TableColumnForm')

const designer = {
  page: {
    route: {
      path: '',
      meta: {
        title: ''
      }
    },
    dir: '',
    api: '',
    idProp: 'id',
    action: [], //['delete', 'export', 'import'],
    serialNumber: false
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
      designer: localStorage.getItem('ms-designer') ? JSON.parse(localStorage.getItem('ms-designer')) : designer
    }
  },
  watch: {
    designer: {
      handler (value) {
        localStorage.setItem('ms-designer', JSON.stringify(designer))
      },
      deep: true
    }
  },
  methods: {
    handleSearchForm (params) {
      let designer = this.designer
      ms.navigator.push(this, SearchForm, {
        title: params ? '编辑' : '创建',
        params,
        promiseSubmit (form) {
          let result = designer.search.option.find(item => item.prop === form.prop)
          if (result) {
            result.label = form.label
            result.prop = form.prop
            result.component = form.component
          } else {
            designer.search.option.push({
              label: form.label,
              prop: form.prop,
              component: form.component
            })
          }
          return Promise.resolve(form)
        }
      })
    },
    handleSearchFormRemove ({prop}) {
      this.$confirm('确认删除该搜索项?', '提示', {
        type: 'warning'
      }).then(() => {
        this.designer.search.option = this.designer.search.option.filter(item => item.prop !== prop)
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
          designer.tabs.prop = form.prop
          let result = designer.tabs.option.find(item => item.name === form.name)
          if (result) {
            result.label = form.label
            result.name = form.name
          } else {
            designer.tabs.option.push({
              label: form.label,
              name: form.name
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
    handleTableForm () {
      let designer = this.designer
      ms.navigator.push(this, TableForm, {
        title: '设置',
        params: {
          ...designer.page
        },
        promiseSubmit (form) {
          Object.keys(form).forEach(key => {
            designer.page[key] = form[key]
          })
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
              /*
              // localStorage.removeItem('ms-designer')
              setTimeout(() => {
                this.$router.push({
                  path: designer.page.route.path
                })
              }, 2000)
              */
            }
          })
        }
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
          let result = designer.table.column.find(item => item.prop === form.prop)
          if (result) {
            result.label = form.label
            result.prop = form.prop
          } else {
            designer.table.column.push({
              label: form.label,
              prop: form.prop
            })
          }
          if (form.action.includes('search')) {
            let result = designer.search.option.find(item => item.prop === form.prop)
            if (result) {
              result.label = form.label
              result.prop = form.prop
            } else {
              designer.search.option.push({
                label: form.label,
                prop: form.prop
              })
            }
          }
          if (form.action.includes('create') || form.action.includes('update')) {
            let result = designer.form.option.find(item => item.prop === form.prop)
            if (result) {
              result.label = form.label
              result.prop = form.prop
              result.action = form.action
            } else {
              designer.form.option.push({
                label: form.label,
                prop: form.prop,
                action: form.action,
                component: 'el-input'
              })
            }
          }
          return Promise.resolve(form)
        }
      })
    },
    handleTableColumnFormRemove ({property}) {
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
