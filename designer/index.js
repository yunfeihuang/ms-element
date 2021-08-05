'use strict'
const fs = require('fs')
const path = require('path')
const archiver = require('archiver');
var bodyParser = require('body-parser');

const writeFileRecursive = function(_path, buffer, callback){
  fs.mkdir(path.parse(_path).dir, {recursive: true}, (err) => {
      if (err) return callback(err);
      fs.writeFile(_path, buffer, function(err){
          if (err) return callback(err);
          return callback(null);
      });
  });
}

module.exports = function (app) {
  // 解析 application/json
  app.use(bodyParser.json()); 
  // 解析 application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded());
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
  app.get('/designer/download/:fileName', function(req, res) {
    var fileName = req.params.fileName
    var filePath = path.join(__filename, '../../src/views', fileName)
    var stats = fs.statSync(filePath)
    if(stats.isFile()){
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + fileName,
        'Content-Length': stats.size
      });
      fs.createReadStream(filePath).pipe(res)
    } else {
      res.end(404)
    }
  })

  app.post('/designer', function(req, res) {
    const config = req.body.config
    console.log('req.body.config', req.body.config)
    const page = `
  <template>
  <!--PageListLayout有四个插槽:breadcrumb,search,table,pagination(这个是默认存在的)-->
  <ms-page-list-layout>
    <template slot="search">
      <ms-search-form :option="searchOption" @submit="handleSubmit">
        <el-tabs slot="prepend" v-model="query.${config.tabs.prop}" type="card" @tab-click="handleTab">
          <el-tab-pane v-for="(item,index) in tabsOption" :key="index" v-bind="item"></el-tab-pane>
        </el-tabs>
        ${config.form.option.some(item => item.action.includes('create')) ? `<el-button size="small" @click="handleForm()">创建</el-button>` : ''}
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
      <el-table-column label="操作">
        <template v-slot="scope">
          ${config.form.option.some(item => item.action.includes('update')) ? `<el-button type="text" @click="handleForm(scope.row)">编辑</el-button>` : ''}
          ${config.page.delete ? `<el-button size="small" @click="handleDelete(scope.row)">删除</el-button>` : ''}
        </template>
      </el-table-column>
    </el-table>
    <template slot="action">
      ${config.page.import ? `<el-button size="small" @click="handleImport()">导入</el-button>` : ''}
      ${config.page.export ? `<el-button size="small" @click="handleExport()">导出</el-button>` : ''}
      ${config.page.batchDelete ? `<el-button size="small" @click="handleDelete()">删除</el-button>` : ''}
    </template>
  </ms-page-list-layout>
</template>

<script>
const Form = () => import('./components/Form')
const api = ms.restful('${config.page.api}')

export default {
  name: '${config.page.module}',
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
      return api.fetch(query)
    },
    handleDelete (row) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        api.delete(row[${config.page.idProp}]).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleForm (row) {
      ms.navigator.push(this, Form, {
        params: row,
        title: row ? '编辑' : '创建'
      })
    }
  }
}
</script>`

const Form = `<el-form v-bind="getFormProps()" @submit.native.prevent="handleSubmit">
  ${config.form.option.map(function (item) {
    return `<el-form-item label="${item.prop}" :rules="${item.rules}">
    <${item.component} v-model="form.${item.prop}"></${item.component}>
  </el-form-item>`
  })}
</el-form>`
  console.log('page', Form)
    let _path = path.join(__filename, `../../src/views/${config.page.module}/index.vue`)
    writeFileRecursive(_path, page, function (err) {
      if (!err) {
        if (config.form && config.form.option && config.form.option.length) {
          writeFileRecursive(path.join(__filename, `../../src/views/${config.page.module}/components/Form.vue`), Form, function (err) {
            if (!err) {
              const output = fs.createWriteStream(`${path.parse(_path).dir}.zip`);
              const archive = archiver('zip');
              archive.on('error', function (err) {
                throw err;
              });
              archive.pipe(output);
              // 文件夹压缩
              archive.directory(path.parse(_path).dir, false);
              archive.finalize();
              res.json({ code: 200, data:  `/designer/download/${config.page.module}.zip`});
            } else {
              res.json({ code: 500 });
            }
          })
        } else {
          res.json({ code: 200, data:  `/designer/download/${config.page.module}.zip`});
        }
      } else {
        res.json({ code: 500 });
      }
    })
  })
}
