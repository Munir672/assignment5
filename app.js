//importing express and the database connection and declaring express application
import express from 'express';
import { client, connection } from './database.js';
const app = express();

//---------------------------Other things to do--------------
app.set('view engine', 'ejs');

//---------------------Server and connection-----------------------------------------------------
let server;
connection.then(()=>{
  console.log("Successful connection to database!");
  server = app.listen(3000, ()=>console.log('Server listening.'));
})
.catch(e=>console.error(e));

//use assignment 5 data base as our database
const database = client.db('assignment-5');

//use the public folder as the static files place
app.use(express.static('public'));
//allow the application to reach the form body 
app.use(express.urlencoded({ extended: true }))

//make a route for first page and send the index file 
app.get('/', (req,res)=>{
    res.render('index', { message: "" });
});

//here we do the page when they submit it 
app.post('/tv-shows', (req,res)=>{
    // TODO
    //Making new tv show 
    let newTvShow = {
        title: req.body.title, 
        year: Number(req.body.year), 
        rating: Number(req.body.rating), 
        actors:[String(req.body.firstActor), String(req.body.secondActor)] 
    }
   
    // Insert that into MongoDB
    database.collection("tv-shows").insertOne(newTvShow)
        .then(() =>{
            res.render('index', { message: ` Successfully added show: ${newTvShow.title}` });
        })
        .catch(error => {
            console.error(" Error is happening:", error);
            res.render('error', { message: "Failed to add the TV show. Please try again." });
        });

    })

//here is the search endpoint for all search type
app.get('/tv-shows', (req, res) =>{

    //we make 4 variables for title, rangeStart, rangeEnd and actors
    let { title, rangeStart, rangeEnd, actor } = req.query;
    let query = {};

    //if there is a title
    if (title) {
        // Search by title
        query.title = title;
        
    } else if (rangeStart) { // if there is a range start

        const start =  Number(rangeStart); // Convert it to number
        const end =  Number(rangeEnd) ; // same

        // If both rangeStart and rangeEnd are provided
        if (start && end) {
            query.year = { $gte: start, $lte: end }; // greater than the start and less than end or equal
        }
    } else if (actor) { //elss if actor is there
        // Search by actor
        query.actors = actor;  
    }

    // Fetch results from MongoDB and sort by rating (descending order)
    database.collection('tv-shows')
        .find(query)
        .sort({ rating: -1 })  // Sort by rating in descending order
        .toArray()
        .then(tvShows => {
            res.render('search-results', { searchResults: tvShows });
        })
        .catch(error => {
            console.error(error);
            res.render('error');
        });

}); 