const utils = require('../utils')
module.exports = function (designer) {
  return `
<template>
  <!--PageListLayout有四个插槽:,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form :option="searchOption" @submit="handleSubmit">
        ${designer.tabs.option.length ? `<el-tabs slot="prepend" v-model="query.${designer.tabs.prop}" type="card" @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in tabsOption" :key="index" v-bind="item"></el-tab-pane>
        </el-tabs>\n` : ''}${designer.form.option.some(item => item.action.includes('create')) ? `<el-button size="small" @click="handleForm()">创建</el-button>` : ''}
      </ms-search-form>
    </template>
    <el-table slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      ${designer.page.action.includes('import') || designer.page.action.includes('export') || designer.page.action.includes('delete') ? `<el-table-column
        type="selection"
        width="58">
      </el-table-column>\n` : ''}${designer.page.serialNumber ? `<el-table-column
        v-bind="getIndexColumnProps()">
      </el-table-column>\n` : ''}${designer.table.column.map(function (item) {
        return `<el-table-column
        label="${item.label}">
        <template v-slot="scope">
          {{scope.row.${item.prop}}}
        </template>
      </el-table-column>`
      }).join('\n')}
      <el-table-column label="操作">
        <template v-slot="scope">
          ${designer.form.option.some(item => item.action.includes('update')) ? `<el-button type="text" @click="handleForm(scope.row)">编辑</el-button>` : ''}
          <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template slot="action">
      ${designer.page.action.includes('import') ? `<el-button size="small" @click="handleImport()">导入</el-button>` : ''}
      ${designer.page.action.includes('export') ? `<el-button size="small" @click="handleExport()">导出</el-button>` : ''}
      ${designer.page.action.includes('delete') ? `<el-button :disabled="multipleSelectionAll.length==0" size="small" @click="handleBatchDelete()">删除</el-button>` : ''}
    </template>
  </ms-page-list-layout>
</template>

<script>
const api = ms.restful('${designer.page.api}')

export default {
  name: '${designer.page.dir}',
  route: ${JSON.stringify(designer.page.route, null, 2).replace(/"/g,"'")},
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      multipleSelectionProp: '${designer.page.idProp}',
      tabsOption: ${JSON.stringify(designer.tabs.option, null, 2).replace(/"/g,"'")},
      searchOption: ${JSON.stringify(designer.search.option, null, 2).replace(/"/g,"'")},
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        ${designer.search.option.map(item => {
          return `${item.prop}: null`
        }).join(',\n')},
        ...this.$route.query
      })
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      return api.get({query})
    },
    handleDelete (row) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        api.delete({url: '/' + row[${designer.page.idProp}]}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleBatchDelete () {
      this.$confirm('确定删除选中的数据?', '提示', {
        type: 'warning'
      }).then(() => {
        let data = {delete: this.multipleSelectionAll.map(item => {return item["${designer.page.idProp}"]})}
        api.batch({data}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleForm (row) {
      ms.navigator.push(this, () => import('./components/Form'), {
        params: row,
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
`
}