const utils = require('../utils')
module.exports = function (designer) {
  const renderChildren = function ({component, slots, prop, label}) {
    if (component === 'el-upload') {
      return `\n<el-button>上传</el-button>\n`
    }
    let tag = ''
    if (component === 'el-select') {
      tag = 'el-option'
    } else if (component === 'el-checkbox-group') {
      tag = 'el-checkbox'
    } else if (component === 'el-radio-group') {
      tag = 'el-radio'
    }
    if (slots && slots.length) {
      return `\n${slots.map(item => {
        return `<${tag}${utils.objectToProps(item)} placeholder="请输入${label}"></${tag}>`
      }).join('\n')}\n`
    }else{
      return ''
    }
  }
  return `
<template>
  <!--PageListLayout有四个插槽:,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form :search-slots="searchSlots" v-bind="getSearchFormProps()" @submit="handleSubmit">
        ${designer.tabs.option.length ? `<el-tabs slot="prepend" v-model="query.${designer.tabs.prop}" type="card" @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in tabsOption" :key="index" v-bind="item"></el-tab-pane>
        </el-tabs>\n` : ''}${designer.search.option.map(item => {
          return `<el-form-item slot="$${item.prop}"${utils.objectToProps({prop:item.prop, label: item.label})}>\n<${item.component}${utils.objectToProps(item.props)} v-model="query.${item.prop}" clearable>${renderChildren(item)}</${item.component}>\n</el-form-item>`
        }).join('\n')}
        ${designer.form.option.some(item => item.action.includes('create')) ? `<el-button size="small" @click="handleForm()">创建</el-button>` : ''}
        </ms-search-form>
    </template>
    <el-table slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      ${designer.setting.table.batch.some(item => ['import', 'export', 'delete', 'update'].includes(item.type)) ? `<el-table-column
        type="selection"
        width="58">
      </el-table-column>\n` : ''}${designer.setting.table.serialNumber ? `<el-table-column
        v-bind="getIndexColumnProps()">
      </el-table-column>\n` : ''}${designer.table.column.filter(item => !item.hidden).map(function (item) {
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
          ${designer.setting.table.batch.some(item => ['delete'].includes(item.type)) ? `<el-button type="text" @click="handleDelete(scope.row)">删除</el-button>`:''}
        </template>
      </el-table-column>
    </el-table>
    <template slot="action">${designer.setting.table.batch.map(item => {
        if (item.type === 'delete') {
          return `<el-button :disabled="multipleSelectionAll.length==0" size="small" @click="handleBatchDelete()">${item.label}</el-button>`
        } else if (item.type === 'import') {
          return `<el-upload style="display:inline-block;" action="${designer.setting.restfulApi}/import">
            <el-button size="small" @click="handleImport()">${item.label}</el-button>
          </el-upload>`
        } else if (item.type === 'export') {
          return `<el-button size="small" @click="handleExport()">${item.label}</el-button>`
        } else {
          return `<el-button size="small">${item.label}</el-button>`
        }
      }).join('\n')}
    </template>
  </ms-page-list-layout>
</template>

<script>
const restfulApi = '${designer.setting.restfulApi || ''}'
const api = ms.restful(restfulApi)

export default {
  name: '${designer.setting.dir.split('/').join('-')}',
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      multipleSelectionProp: '${designer.setting.idProp}',
      tabsOption: ${JSON.stringify(designer.tabs.option, null, 2).replace(/"/g,"'")},
      searchSlots: ${JSON.stringify(designer.search.option.map(item => item.prop)).replace(/"/g,"'")},
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
      if (restfulApi) {
        return api.get({query})
      } else {
        return Promise.resolve({data: { total: 1000, data: JSON.parse(\`${JSON.stringify(designer.setting.table.data)}\`)}})
      }
    },
    handleDelete (row) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        api.delete({url: '/' + row[${designer.setting.idProp}]}).then(res => {
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
        let data = {delete: this.multipleSelectionAll.map(item => {return item["${designer.setting.idProp}"]})}
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