const express = require('express');
const chalk = require('chalk');
const path = require('path')
const { addNote, getNotes, removeNote, editNote } = require('./notes.controller');

const port = 3000;
// const basePath = path.join(__dirname, 'pages');
const app = express();

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get('/', async (req, res) => {
  // res.sendFile(path.join(basePath, 'index.html'))
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  })
})

app.post('/', async (req, res) => {
  await addNote(req.body.title)
  // res.sendFile(path.join(basePath, 'index.html'))
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: true,
  })
})

app.delete('/:id', async (req, res) => {
  await removeNote(req.params.id)
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false
  })
})

app.put('/:id', async (req, res) => {
  const { title } = req.body;
  await editNote(req.params.id, title);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(chalk.green(`Server has been started on port ${port} ...`));

});