const express = require('express');
const chalk = require('chalk');
const path = require('path')
const yargs = require('yargs')
const { addNote, getNotes, removeNote, editNote } = require('./notes.controller');



yargs.command({
  command: 'add',
  describe: 'Add new note to list',
  builder: {
    title: {
      type: 'string',
      describe: 'Note title',
      demandOption: true
    }
  },
  handler({ title }) {
    addNote(title)
  }
})

yargs.command({
  command: 'list',
  describe: 'Print all notes',
  async handler() {
    await printNotes()
  }
})
yargs.command({
  command: 'remove',
  describe: 'Remove note by id',
  builder: {
    id: {
      describe: 'Note ID',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    removeNote(argv.id);
  }
})
yargs.command({
  command: 'edit',
  describe: 'Edit note by id',
  builder: {
    id: {
      describe: 'Note ID',
      demandOption: true,
      type: 'string'
    },
    title: {
      describe: 'New note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    editNote(argv.id, argv.title);
  }
})

yargs.parse()




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