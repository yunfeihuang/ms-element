<template>
  <div class="ms-designer">
    <ms-page-list-layout>
      <el-form v-bind="getFormProps({class: ['form-search','ms-search-form']})" slot="search">
        <div class="ms-designer--pagelist-tabs ms-search-form--prepend">
          <el-tabs
            type="card"
            editable
            :value="config.tabs.option[0] ? config.tabs.option[0].name : ''"
            @tab-add="handleTabsForm()"
            @tab-click="handleTabsForm"
            @tab-remove="handleTabRemove">
            <el-tab-pane v-for="(item,index) in config.tabs.option" :key="index" v-bind="item">
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="ms-designer--pagelist-search">
          <el-tooltip placement="top" v-for="(item,index) in config.search.option" :key="index">
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
        </div>
      </el-form>
      <div class="ms-designer--pagelist-table" slot="table">
        <el-table
          v-bind="getTableProps()"
          v-on="getTableListeners()"
          :data="[{}]"
          @header-click="handleTableColumnForm">
          <el-table-column v-for="(item,index) in config.table.column" :key="index" v-bind="item">
            <template v-slot:header="scope">
              <el-tooltip placement="top">
                <el-button type="text" slot="content" @click="handleTableColumnFormRemove(scope.column)">删除</el-button>
                <span>{{scope.column.label}}</span>
              </el-tooltip>
            </template>
            <template v-if="item.actions">
              <el-button v-for="(item, index) in item.action" :key="index" type="text">
                {{item.label}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template slot="header">
              <el-tooltip content="创建表格列" placement="top">
                <el-button size="mini" icon="el-icon-plus" @click.stop="handleTableColumnForm()"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ms-page-list-layout>
  </div>
</template>

<script>
const Form = () => import('./components/Form')
const TabsForm = () => import('./components/TabsForm')
const TableForm = () => import('./components/TableForm')

export default {
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      config: {
        tableData: [
          {}
        ],
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
    }
  },
  methods: {
    handleSearchForm (params) {
      let config = this.config
      ms.navigator.push(this, Form, {
        title: params ? '编辑' : '创建',
        params,
        promiseSubmit (form) {
          let result = config.search.option.find(item => item.prop === form.prop)
          if (result) {
            result.label = form.label
            result.prop = form.prop
            result.component = form.component
          } else {
            config.search.option.push({
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
        this.config.search.option = this.config.search.option.filter(item => item.prop !== prop)
      })
    },
    handleTabsForm (tab) {
      let config = this.config
      ms.navigator.push(this, TabsForm, {
        title: tab ? '编辑' : '创建',
        params: tab ? {
          label: tab.label,
          name: tab.name,
          prop: config.tabs.prop
        } : {prop: config.tabs.prop},
        promiseSubmit (form) {
          config.tabs.prop = form.prop
          let result = config.tabs.option.find(item => item.name === form.name)
          if (result) {
            result.label = form.label
            result.name = form.name
          } else {
            config.tabs.option.push({
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
        this.config.tabs.option = this.config.tabs.option.filter(item => item.name !== name)
      })
    },
    handleTableColumnForm (column, event) {
      let config = this.config
      ms.navigator.push(this, TableForm, {
        title: column ? '编辑' : '创建',
        params: column ? {
          label: column.label,
          prop: column.property,
          isSearch: config.search.option.some(item => item.prop === column.property)
        } : undefined,
        promiseSubmit (form) {
          let result = config.table.column.find(item => item.prop === form.prop)
          if (result) {
            result.label = form.label
            result.prop = form.prop
          } else {
            config.table.column.push({
              label: form.label,
              prop: form.prop
            })
          }
          if (form.isSearch) {
            let result = config.search.option.find(item => item.prop === form.prop)
            if (result) {
              result.label = form.label
              result.prop = form.prop
            } else {
              config.search.option.push({
                label: form.label,
                prop: form.prop
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
        this.config.table.column = this.config.table.column.filter(item => item.prop !== property)
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
