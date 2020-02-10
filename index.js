require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const morgan = require('morgan')
//defining token for showing POST content
morgan.token('postData', (req) => { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//non-functional at present, patching for 3.18
/* app.get('/info',(req, res) => {
    const p = persons.length
    const reqTime = new Date().toLocaleString()
    const body = `
    <div>
    Phonebook has info of ${p} people</br>
    <p>${reqTime}</p>
    </div>`
     
    //use .render(html)??
    res.send(body)
}) */

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
  Person.findById(req.params.id)
      .then(p => {
        p.delete().then(
          res.status(204).end()
        )
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
              error: 'name already in phonebook' 
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
            }
          }).catch( e => {console.log('error:', e.message)})
  }
)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})