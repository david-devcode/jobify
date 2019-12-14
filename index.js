const express = require('express')
const app = express()

const sqlite = require('sqlite')
const dbConnection = sqlite.open('banco.sqlite', { Promise })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', async (request, response) => {
    const db = await dbConnection    
    const categoriasDb = await db.all('select * from  categorias;')
    const vagas = await db.all('select * from vagas;')
    const categorias = categoriasDb.map(cat => {
        return {
            ...cat,
            vagas: vagas.filter(vaga => vaga.categoria === cat.id)
        }
    })
    response.render('home', {
        categorias
    })
})
app.get('/vaga', (request, response) => {
   
    response.render('vaga')
})

const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists categorias(id INTEGER PRIMARY KEY, categoria TEXT);')
    await db.run('create table if not exists vagas(id INTEGER PRIMARY KEY, title TEXT, description TEXT);')
    // const categoria = 'Marketing Team'
    // await db.run(`insert into categorias(categoria) values('${categoria}')`)   
    // const vaga = 'Marketing Digital'
    // const description = 'Experiência em marketing'
    // await db.run(`insert into vagas(title, description) values(2,'${vaga}, ${description}')`)    

}
init()
app.listen(3000, (err) => {
    if(err) {
        console.log('Não foi possível iniciar o servidor')
    } else {
        console.log('Servidor rodando')
    }
})