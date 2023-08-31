const PORT = process.env.PORT || 3005;
//initializing express
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

//calling express
const app = express();

//app.use and app.get are examples of properties coming from express


//array of articles that I want to scrape
//make title lowercase bc it's case sensative
const journals = [
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=2"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=3"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=4"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=5"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=6"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=7"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=8"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=9"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=10"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=11"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=12"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=13"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=14"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=15"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=16"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=17"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=18"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=19"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=20"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=21"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=22"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=23"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=24"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=25"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=26"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=27"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=28"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=29"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=30"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=31"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=32"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=33"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=34"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=35"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=36"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=37"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=38"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=39"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=40"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=41"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=42"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=43"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=44"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=45"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=46"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=47"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=48"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=49"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=50"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=51"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=52"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=53"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=54"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=55"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=56"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=57"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=58"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=59"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=60"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=61"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=62"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=63"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=64"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=65"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=66"

    },
    {
        name: "NIH%20National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=67"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=68"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=69"

    },
    {
        name: "NIH National Library of Medicine",
        address: "https://pubmed.ncbi.nlm.nih.gov/?term=rheumatoid%20arthritis&sort=date&size=200&page=70"
    }
]


//scraping internet for information
app.get('/news', (req, res) => {
    const articles = [];

    const fetchPromises = journals.map(journal => {
        return axios.get(journal.address)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const baseUrls = { "NIH National Library of Medicine": "https://pubmed.ncbi.nlm.nih.gov" };

                $('a:contains("rheumatoid arthritis")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while scraping data.' });
            });
    });

    Promise.all(fetchPromises)
        .then(() => {
            res.json(articles);
        });
});


//listening out for whenever we visit homepage, then get the respnose json; 
app.get('/', (req, res) => {
    res.json('Welcome to my Medical News API')
})


//getting single article
app.get('/news/:journalId', (req, res) => { // Note the ':' before journalId
    const journalId = req.params.journalId;

    // Find the journal by its name
    const journal = journals.find(journal => journal.name === journalId);

    if (!journal) {
        return res.status(404).json({ error: 'Journal not found.' });
    }

    console.log("fetch data:", journalId)
    axios.get(journal.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const baseUrls = { "NIH National Library of Medicine": "https://pubmed.ncbi.nlm.nih.gov" };

            const articles = [];

            $('a:contains("rheumatoid arthritis")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;


                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            res.json(articles);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while scraping data.' });
        });
});

//Add more journals (from different articles) to journals array; add base to journals array and then remove it 


//listen for any changes on port 3005
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));