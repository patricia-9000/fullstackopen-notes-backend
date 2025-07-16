//Start express
const express = require('express')
const app = express()
app.use(express.static('dist'))

//Use CORS
const cors = require('cors')
app.use(cors())

//Use JSON parser
app.use(express.json())

//Use Morgan
const morgan = require('morgan')
app.use(morgan('tiny'))

//Data array
let notes = [
  {
    id: "1",
    content: "note 1 content",
    important: true
  },
  {
    id: "2",
    content: "note 2 content",
    important: false
  },
  {
    id: "3",
    content: "note 3 content",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  
  return String(maxId + 1)
}

//GET all
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

//GET single
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note)
    response.json(note)
  else
    response.status(404).end()
})

//DELETE
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)

  if (note)
  {
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
  }
  else
    response.status(404).end()
})

//POST
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(note)
  response.json(note)
})

//Return error for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

//Listen on port
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
