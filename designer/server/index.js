'use strict'
const fs = require('fs')
const path = require('path')
const archiver = require('archiver');
var bodyParser = require('body-parser');
const pageList = require('./components/pageList')
const form = require('./components/form')
const route = require('./components/route')

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

  let exampleData = []
  for (let i = 0; i < 20; i++) {
    exampleData.push({
      id: Math.random().toString(),
      date: new Date().toLocaleString(),
      name: `张三${i}`,
      address: `上海市普陀区金沙江路${i}号`,
      age: Math.floor(Math.random() * 100),
      email: `${Math.floor(Math.random() * 100000000)}@qq.com`,
      state: '启用',
      url: '/static/images/img_qr.jpg',
      sex: '男',
      hoppy: ['足球', '篮球'],
      start_time: new Date().toLocaleString(),
      end_time: new Date().toLocaleString(),
      desc: '如果出现发生系统错误 1067 请把db目录下的mongod.lock文件删除后重新输入net start MongoDB启动服务即可'
    })
  }
  app.get('/designer/example/data', function(req, res) {
    res.json({code: 200, data: {total: 100, rows: 20, data: exampleData}})
  })
  app.put('/designer/example/data', function(req, res) {
    res.json({code: 200, data: exampleData[0]})
  })
  app.post('/designer/example/data', function(req, res) {
    res.json({code: 200, data: exampleData[0]})
  })
  app.delete('/designer/example/data', function(req, res) {
    res.json({code: 200})
  })

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
    const designer = req.body.designer
    let root = `../../../src/views/${designer.setting.dir}`
    writeFileRecursive(path.join(__filename, root, '/index.vue'), pageList(designer), function (err) {
      if (!err) {
        if (designer.form && designer.form.option && designer.form.option.length) {
          writeFileRecursive(path.join(__filename, root, '/components/Form.vue'), form(designer), function (err) {
            if (!err) {
              writeFileRecursive(path.join(__filename, root, '/route.js'), route(designer), function (err) {
                if (!err) {
                  writeFileRecursive(path.join(__filename, root, '/designer.json'), JSON.stringify(designer), function (err) {
                    if (!err) {
                      res.json({ code: 200 });
                    } else {
                      res.json({ code: 500, msg: err });
                    }
                  });
                } else {
                  res.json({ code: 500, msg: err });
                }
              })
              /*
              const output = fs.createWriteStream(`${path.parse(_path).dir}.zip`);
              const archive = archiver('zip');
              archive.on('error', function (err) {
                throw err;
              });
              archive.pipe(output);
              // 文件夹压缩
              archive.directory(path.parse(_path).dir, false);
              archive.finalize();
              */
            } else {
              res.json({ code: 500, msg: err });
            }
          })
        } else {
          res.json({ code: 200 });
        }
      } else {
        res.json({ code: 500, msg: err });
        throw err;
      }
    })
  })
  const dirPath = '../../data/dir'
  app.get('/designer/dir/:id', function(req, res) {
    fs.readFile(path.join(__filename, dirPath, `/${req.params.id}.json`), 'utf-8', function (err, data) {
      if (err) {
        res.json({ code: 500, msg: err })
      } else {
        data = data + ''
        res.json({ code: 200, data: data && data.trim() ? JSON.parse(data) : [] })
      }
    })
  })
  app.put('/designer/dir/:id', function(req, res) {
    fs.writeFile(path.join(__filename, dirPath, `/${req.params.id}.json`), JSON.stringify(req.body.dir), function(err){
      if (err) {
        res.json({ code: 500, msg: err })
      } else {
        res.json({ code: 200 })
      }
    })
  })
  const designerPath = '../../data/designer'
  app.get('/designer/config/:id', function(req, res) {
    fs.readFile(path.join(__filename, designerPath, `/${req.params.id}.json`), 'utf-8', function (err, data) {
      if (err) {
        res.json({ code: 200, data: null })
      } else {
        data = data + ''
        res.json({ code: 200, data: data ? JSON.parse(data) : null })
      }
    })
  })
  app.put('/designer/config/:id', function(req, res) {
    fs.writeFile(path.join(__filename, designerPath, `/${req.params.id}.json`), JSON.stringify(req.body.designer), function(err){
      if (err) {
        res.json({ code: 500, msg: err })
      } else {
        res.json({ code: 200 })
      }
    })
  })
  app.post('/designer/generate', function(req, res) {
    const designer = req.body.designer
    let root = `../../../src/views/${designer.setting.dir}`
    writeFileRecursive(path.join(__filename, root, '/index.vue'), pageList(designer), function (err) {
      if (!err) {
        if (designer.form && designer.form.option && designer.form.option.length) {
          writeFileRecursive(path.join(__filename, root, '/components/Form.vue'), form(designer), function (err) {
            if (!err) {
              writeFileRecursive(path.join(__filename, root, '/route.js'), route(designer), function (err) {
                if (!err) {
                  writeFileRecursive(path.join(__filename, root, '/designer.json'), JSON.stringify(designer), function (err) {
                    if (!err) {
                      res.json({ code: 200 });
                    } else {
                      res.json({ code: 500, msg: err });
                    }
                  });
                } else {
                  res.json({ code: 500, msg: err });
                }
              })
            } else {
              res.json({ code: 500, msg: err });
            }
          })
        } else {
          res.json({ code: 200 });
        }
      } else {
        res.json({ code: 500, msg: err });
        throw err;
      }
    })
  })
}
