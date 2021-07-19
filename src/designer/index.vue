<template>
  <div class="ms-designer">
    <ms-page-list-layout>
      <div class="ms-search-form" slot="search">
        <el-form v-bind="getFormProps()">
          <div class="ms-designer--pagelist-tabs ms-search-form--prepend">
            <el-tabs type="card" editable :value="config.tabs.option[0].name" @tab-add="handleTabsForm()" @tab-click="handleTabsForm()">
              <el-tab-pane v-for="(item,index) in config.tabs.option" :key="index" v-bind="item">
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="ms-designer--pagelist-search">
            <el-form-item v-for="(item,index) in config.search.option" :key="index" :label="item.label" @click.native="handleForm()">
              <component :is="item.type || 'el-input'" v-bind="item.props" readonly/>
            </el-form-item>
            <el-form-item>
              <el-button style="min-width:0" icon="el-icon-plus" circle @click="handleForm()"></el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="ms-designer--pagelist-table" slot="table">
        <el-table
          v-bind="getTableProps()"
          v-on="getTableListeners()"
          :data="[{}]"
          @header-click="handleTableForm()">
          <el-table-column v-for="(item,index) in config.table.column" :key="index" v-bind="item">
            <template v-if="item.actions">
              <el-button v-for="(item, index) in item.action" :key="index" type="text">
                {{item.label}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              <el-button size="mini" @click.stop="handleTableForm()">创建</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </ms-page-list-layout>
  </div>
</template>

<script>
import Widget from './components/Widget'

const Form = () => import('./components/Form')
const TabsForm = () => import('./components/TabsForm')
const TableForm = () => import('./components/TableForm')

export default {
  components: {
    Widget
  },
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      config: {
        tabs: {
          option: [
            {
              label: 'tab1',
              name: 'tab1'
            },
            {
              label: 'tab2',
              name: 'tab2'
            }
          ]
        },
        search: {
          option: [
            {
              type: 'el-input',
              label: '关键字',
              prop: 'aa',
              props: {}
            }
          ]
        },
        table: {
          column: [
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
          ]
        }
      }
    }
  },
  methods: {
    handleForm () {
      ms.navigator.push(this, Form, {
        title: '创建',
        params: {
          keyword: '张三'
        }
      })
    },
    handleTabsForm () {
      ms.navigator.push(this, TabsForm, {
        title: '创建',
        params: {
          keyword: '张三'
        }
      })
    },
    handleTableForm () {
      ms.navigator.push(this, TableForm, {
        title: '创建',
        params: {
          keyword: '张三'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .ms-designer-snippet{
    outline: 1px dashed #ccc;
    outline-offset: 4px;
  }
</style>
