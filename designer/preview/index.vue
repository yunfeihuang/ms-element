<template>
  <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form
        :search-slots="designer.search.option.map(item => item.prop)"
        v-bind="getSearchFormProps()"
        @submit="handleSubmit">
        <el-tabs
          v-if="designer.tabs.option.length"
          slot="prepend"
          type="card"
          v-model="query[designer.tabs.prop]"
          @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in designer.tabs.option" :key="index" v-bind="item"></el-tab-pane>
        </el-tabs>
        <el-form-item v-for="(item,index) in designer.search.option" :key="index" :label="item.label" :prop="item.prop" :slot="item.prop+'-slot'">
          <component :is="item.component || 'el-input'" v-model="query[item.prop]" :placeholder="'请输入'+item.label" clearable></component>
        </el-form-item>
        <el-button size="small" @click="handleForm()">创建</el-button>
      </ms-search-form>
    </template>
    <!--v-bind="getTableProps()"是必须的-->
    <el-table slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
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
      </el-table-column>
      <el-table-column label="操作" v-if="designer.setting.table.batch.some(item => ['delete'].includes(item.type)) || designer.form.option.some(item => item.action.includes('update'))">
        <template v-slot="scope">
          <el-button type="text" v-if="designer.form.option.some(item => item.action.includes('update'))" @click.stop="handleForm(scope.row)">编辑</el-button>
          <el-button type="text" v-if="designer.setting.table.batch.some(item => ['delete'].includes(item.type))" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="action">
      <el-button
        size="small"
        v-for="(item,index) in designer.setting.table.batch"
        :key="index"
        :disabled="item.type == 'delete' ? multipleSelectionAll.length === 0 : false">{{item.label}}</el-button>
    </template>
  </ms-page-list-layout>
</template>

<script>
import axios from 'axios'
let api = null
let designer = null
export default {
  mixins: [
    ms.mixins.pageList
  ],
  beforeRouteEnter (to, from, next) {
    designer = JSON.parse(sessionStorage.getItem('--ms-preview'))
    api = ms.restful(designer.setting.api)
    next()
  },
  data () {
    let _query = {}
    designer.search.option.forEach(item => {
      _query[item.prop] = null
    })
    return {
      designer,
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        ..._query,
        ...this.$route.query
      }),
      multipleSelectionProp: designer.setting.idProp // 设置返回的数据列表唯一标识属性名
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      return Promise.resolve({code: 200, data: {total: 1000, data: designer.setting.table.data}})
    },
    handleDelete (row) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        api.delete({url: '/' + row[designer.setting.idProp]}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.refresh()
        })
      })
    },
    handleBatchDelete () {
      this.$confirm('确定删除选中的数据?', '提示', {
        type: 'warning'
      }).then(() => {
        let data = {delete: this.multipleSelectionAll.map(item => {return item[designer.setting.idProp]})}
        api.batch({data}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.refresh()
        })
      })
    },
    handleForm (row) {
      ms.navigator.push(this, () => import('./components/Form'), {
        params: {
          option: designer.form.option.filter(item => item.action.includes(row ? 'update' : 'create')),
          row
        },
        title: row ? '编辑' : '创建'
      })
    },
    handleExport () {
      let query = this.query
      api.export({query: query})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
