const http = require('http');

const fs = require('fs/promises')
const path = require('path')
const { addNote } = require('./notes.controller');

const server = http.createServer(async (req, res) => { //req что пришло на сервер
    if (req.method === 'GET') {
      const content = await fs.readFile(path.join(basePath, 'index.html'))
      // res.setHeader('Content-type', 'text/html')
      res.writeHead(200, {
        'Content-type': 'text/html'
      })
      //рес что отвечаем
      res.end(content)
    } else if (req.method === 'POST') {
      const body = []
      res.writeHead(200, {
        'Content-type': 'text/plain ; charset=utf-8'
      })
      req.on('data', data => {
        body.push(Buffer.from(data))
      })
  
      req.on('end', () => {
        const title = body.toString().split('=')[1].replaceAll('+', ' ');
        addNote(title)
  
        res.end(`title = ${title}`)
  
      })
  
    }
  
  })