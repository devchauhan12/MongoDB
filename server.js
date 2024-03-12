const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/Store')


const bookSchema = new mongoose.Schema({
    bookid: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    booktype: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    publishdate: {
        type: Date,
        required: true,
    },
    author: {
        type: String,
        required: true,
    }

}, { timestamps: true })

const bookModel = mongoose.model('Books', bookSchema)

app.get('/', async (req, res) => {
    const books = await bookModel.find()
    res.render('./pages/home', { books: books })
})

app.get('/addbook', (req, res) => {
    res.render('./pages/addbook')
})

app.post('/addbook', async (req, res) => {
    const book = req.body;

    const newBook = new bookModel(book);
    await newBook.save();

    res.redirect('/')
})

app.get('/deleteBook/:id', async (req, res) => {
    const userId = req.params.id;
    var result = await bookModel.deleteOne(({ _id: userId }))
    res.redirect('/')
})

app.get('/editBook/:id', async (req, res) => {
    const userId = req.params.id;
 
    const book = await bookModel.findById(userId);

    res.render('./pages/editbook', { book });
})

app.post('/editBook/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedBookData = req.body;

    const updatedBook = await bookModel.findByIdAndUpdate(userId, updatedBookData, { new: true });

    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Server Start at 3000');
})