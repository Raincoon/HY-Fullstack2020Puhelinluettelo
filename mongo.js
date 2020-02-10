const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
  console.log('give password as argument')
  process.exit(1)
}
//Y5HCk254dZCsOKnO

const password = process.argv[2]
const name = process.argv[3] || ""
const number = process.argv[4] || ""

const url =
  `mongodb+srv://fsUser:${password}@startercluster0-y2iwm.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length < 5 ) {
    console.log('phonebook:')
    Person
        .find({})
        .then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

} else {
    const person = new Person({
        name,
        number,
    })

    person.save().then(res => {
    console.log('added', res.name,'with number', res.number, 'to phonebook')
    mongoose.connection.close()
    })
}