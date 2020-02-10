const express = require('express')
const app = express()

const morgan = require('morgan')
//defining token for showing POST content
morgan.token('postData', (req) => { return JSON.stringify(req.body) })

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    },
    {
    "name": "Test Data",
    "number": "867-5309",
    "id": 5
    },
    {
    "name": "test",
    "number": "data",
    "id": 6
    }
]
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get('/info',(req, res) => {
    const p = persons.length
    const reqTime = new Date().toLocaleString()
    const body = `
    <div>
    Phonebook has info of ${p} people</br>
    <p>${reqTime}</p>
    </div>`
     
    //use .render(html)??
    res.send(body)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
  }
)

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
  }
)

app.post('/api/persons', (req, res) => {
    app.use(morgan(':postData'))
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({ 
          error: 'missing name or number' 
        })
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({ //this is just copypaste atm, check if error code is right!
            error: 'name already in phonebook' 
          }) 
    }
    //add into data
    const newPerson = {
        "name": person.name,
        "number": person.number,
        "id": Math.floor(Math.random() * 100000 + 10)
    }
    persons = persons.concat(newPerson)
    res.json(newPerson)
  }
)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})