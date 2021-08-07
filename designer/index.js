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
    console.log('req.body.designer', req.body.designer)
    let root = `../../src/views/${designer.setting.dir}`
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
//            res.json({ code: 200, data:  `/designer/download/${name}.zip`});
          res.json({ code: 200 });
        }
      } else {
        res.json({ code: 500, msg: err });
        throw err;
      }
    })
  })
  app.post('/designer/downdown', function(req, res) {

  })
}
