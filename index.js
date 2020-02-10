require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const morgan = require('morgan')
//defining token for showing POST content
morgan.token('postData', (req) => { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info',(req, res) => {
  let p = 0
  Person.find({})
    .then(result => {
    p = result.length
    res.send(
      `<div>
      Phonebook has info of ${p} people</br>
      <p>${reqTime}</p>
      </div>`
    )
  })
  const reqTime = new Date().toLocaleString()  
})

app.get('/api/persons', (req, res) => {
  Person.find({})
        .then(result => {
        res.json(result.map(p => p.toJSON()))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
      .then(p => {
        res.json(p.toJSON())
    })
  }
)

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(r => {
        res.status(204).end()
    })
})

app.put('/api/persons/:id', (req, res) => {
  console.log(req.params)
  const p = req.body

  const person =  {
    name: p.name,
    number: p.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedP => {
        res.json(updatedP.toJSON())
    })
  }
)

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (person.name === undefined || person.number === undefined) {
        return res.status(400).json({ 
          error: 'missing name or number!' 
        })
    }

    //duplicate name check before adding to DB
    Person.find({name: person.name})
          .then( result => {
            if (result.length > 0) {
              return res.status(400).json({ 
              error: 'name already in phonebook, use PUT for editing the person\'s number' 
              })
            } else {
              //add into data
              const newPerson = new Person({
                  "name": person.name,
                  "number": person.number,
              })
              newPerson.save().then( saved => {
                res.json(saved.toJSON())
              })
              .catch(err => next(err))
            }
          })
          
  }
)
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})