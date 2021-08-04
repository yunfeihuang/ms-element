'use strict'
const fs = require('fs')
const path = require('path')

const writeFileRecursive = function(_path, buffer, callback){
  console.log('path', _path)
  fs.mkdir(path.parse(_path).dir, {recursive: true}, (err) => {
      if (err) return callback(err);
      fs.writeFile(_path, buffer, function(err){
          if (err) return callback(err);
          return callback(null);
      });
  });
}

module.exports = function (app) {
  /*
  app.get('/designer', function(req, res) {
    writeFileRecursive(path.join(__filename, '../../src/views/user/index.vue'), 'afdsafdsa', function (err) {
      if (!err) {
        res.json({ code: '200' });
      } else {
        res.json({ code: '500' });
      }
    })
  });
  */
  app.get('/designer', function(req, res) {
    // const config = JSON.parse(req.body.config)
    const config = {
      tabs: {
        prop: 'status',
        option: [
          {
            label: '全部',
            name: 'tab1'
          },
          {
            label: '禁用',
            name: 'tab2'
          }
        ]
      },
      search: {
        option: [
          {
            component: 'el-input',
            label: '关键字',
            prop: 'keyword'
          }
        ]
      },
      table: {
        column: [
          {
            label: '用户名',
            prop: 'username'
          },
          {
            label: '年龄',
            prop: 'age'
          }
        ]
      }
    }
    const data = `
  <template>
  <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form :option="searchOption" @submit="handleSubmit">
        <el-tabs slot="prepend" v-model="query.active" type="card" @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in tabsOption" :key="index" v-bind="item"></el-tab-pane>
        </el-tabs>
        <el-button size="small" @click="handleCreate()">创建</el-button>
      </ms-search-form>
    </template>
    <el-table slot="table"
      v-bind="getTableProps()"
      v-on="getTableListeners()"
      :data="pageData.data">
      ${config.table.column.map(function (item) {
        return `<el-table-column
        label="${item.label}">
        <template v-slot="scope">
          {{scope.row.${item.prop}}}
        </template>
      </el-table-column>`
      }).join('\n')}
    </el-table>
    <template slot="action">
      <el-button size="small">导入</el-button>
      <el-button :disabled="multipleSelectionAll.length==0" size="small" @click="handleExport">导出</el-button>
    </template>
  </ms-page-list-layout>
</template>

<script>
const Form = () => import('./components/Form')
const Detail = () => import('./components/Detail')
const List = () => import('./components/List')
// const api = ms.restful('/user')

export default {
  name: 'user',
  mixins: [
    ms.mixins.pageList
  ],
  data () {
    return {
      tabsOption: ${JSON.stringify(config.tabs.option, null, 2)},
      searchOption: ${JSON.stringify(config.search.option, null, 2)},
      query: this.getQuery({ // 初始化query查询条件数据，查询表单数据要绑定到query对象
        ...this.$route.query
      })
    }
  },
  methods: {
    fetch (query) { // 获取数据的方法，必须要重写
      return this.$axios({
        url: '/user',
        query
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
      ms.navigator.push(this, Form, {
        params,
        title: params ? '编辑' : '创建',
        done: cb => {
          cb()
          this.refresh()
        }
      })
    },
  }
}
</script>`

    writeFileRecursive(path.join(__filename, '../../src/views/user/index.vue'), data, function (err) {
      if (!err) {
        res.json({ code: '200' });
      } else {
        res.json({ code: '500' });
      }
    })
  })
}
