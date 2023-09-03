// Define the port number for your Express.js server.
const PORT = process.env.PORT || 3005;

//Importing required modules
const express = require('express');   //for building server
const axios = require('axios');       //for making http requests
const cheerio = require('cheerio');   //for web scraping
const cache = require('memory-cache');   //for caching data

//Create an instance of express
const app = express();

//app.use and app.get are examples of properties coming from express



//Define an array of journals to scrape. Each journal has a name, keyword, and page number.
const journals = [
    {
        name: "NIH National Library of Medicine",
        keyword: "hidradenitis",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "rheumatoidarthritis",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "migraine",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "diabetes",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "hypertension",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "asthma",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "depression",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "hiv",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "pneumonia",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "psoriasis",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "suicide",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "pregnancy",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "breastcancer",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "allergies",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "stroke",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "pancreatitis",
        page: 1,
    },
    {
        name: "NIH National Library of Medicine",
        keyword: "tuberculosis",
        page: 1,
    }     
]

//Function to generate search URLs based on journals keyword and page numbers
function generateSearchURL(journal) {
    let url = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(journal.keyword)}&sort=date&size=200`;

    //If it's not the first page, add the page number parameter.
    if (journal.page > 1) {
        url += `&page=${journal.page}`;
    }

    return url;
}

//Define cache key for storing scraped data
const cacheKey = 'scrapedData';

//Middleware to check the cache before scraping
const cacheMiddleware = (req, res, next) => {
    const cachedData = cache.get(cacheKey);
  
    if (cachedData) {
      //If data is found in the cache, send it as the response
      res.json(cachedData);
    } else {
      //If data is not in the cache, proceed with scraping
      next();
    }
};

//Define a route for the root endpoint. 
app.get('/', (req, res) => {
    res.json('Welcome to my Medical Articles API')
})


//Define a route for scraping journal articlesuses cache; uses Middleware to check for cached data.
app.get('/journals', cacheMiddleware, (req, res) => {
    const articles = [];

    //Create an array of promises for fetching data from multiple journals.
    const fetchPromises = journals.map(journal => {
        return axios.get(generateSearchURL(journal))
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const baseUrls = { "NIH National Library of Medicine": "https://pubmed.ncbi.nlm.nih.gov" };

                //Use Cheerio to parse the HTML and extract rheumatoid arthritis article information.
                $('a:contains("rheumatoid arthritis")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name,
                        keyword: journal.keyword
                    });
                });

                //Use Cheerio to parse the HTML and extract hidradenitis article information.
                $('a:contains("hidradenitis")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract migraine article information.
                $('a:contains("migraine")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract diabetes article information.
                $('a:contains("diabetes")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract hypertension article information.
                $('a:contains("hypertension")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract asthma article information.
                $('a:contains("asthma")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract depression article information.
                $('a:contains("depression")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract hiv article information.
                $('a:contains("hiv")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });
                
                //Use Cheerio to parse the HTML and extract pneumonia article information.
                $('a:contains("pneumonia")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract psoriasis article information.
                $('a:contains("psoriasis")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract suicide article information.
                $('a:contains("suicide")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract tuberculosis article information.
                $('a:contains("tuberculosis")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract allergies article information.
                $('a:contains("allergies")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract pregnancy article information.
                $('a:contains("pregnancy")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract breastcancer article information.
                $('a:contains("breastcancer")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract stroke article information.
                $('a:contains("stroke")', html).each(function () {
                    const title = $(this).text().trim();
                    const relativeUrl = $(this).attr('href');
                    const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                    articles.push({
                        title: title,
                        url: absoluteUrl,
                        source: journal.name
                    });
                });

                //Use Cheerio to parse the HTML and extract pancreatitis article information.
                $('a:contains("pancreatitis")', html).each(function () {
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

    //Wait for all promises to resolve, then cache the data and send it as a response.
    Promise.all(fetchPromises)
        .then(() => {
            cache.put(cacheKey, articles, 600 * 1000); //cache for 10 mins
            res.json(articles);
        });
});


//Define a route for getting articles from a specific journal.
app.get('/journals/:journalId', (req, res) => { // Note the ':' before journalId
    const journalId = req.params.journalId;

    // Find the journal by its name
    const journal = journals.find(journal => journal.keyword === journalId);

    if (!journal) {
        return res.status(404).json({ error: 'Journal not found.' });
    }

    //Generate ur based on journal's keyword
    const url = generateSearchURL(journal);

    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const baseUrls = { "NIH National Library of Medicine": "https://pubmed.ncbi.nlm.nih.gov" };

            const articles = [];

            //Use Cheerio to parse the HTML and extract rheumatoid arthritis article information.
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

            //Use Cheerio to parse the HTML and extract hidradenitis article information.
            $('a:contains("hidradenitis")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract migraine article information.
            $('a:contains("migraine")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract diabetes article information.
            $('a:contains("diabetes")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract hypertension article information.
            $('a:contains("hypertension")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract asthma article information.
            $('a:contains("asthma")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract depression article information.
            $('a:contains("depression")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract hiv article information.
            $('a:contains("hiv")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract pneumonia article information.
            $('a:contains("pneumonia")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract psoriasis article information.
            $('a:contains("psoriasis")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract suicide article information.
            $('a:contains("suicide")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract tuberculosis article information.
            $('a:contains("tuberculosis")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract allergies article information.
            $('a:contains("allergies")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract pregnancy article information.
            $('a:contains("pregnancy")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract breastcancer article information.
            $('a:contains("breastcancer")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract stroke article information.
            $('a:contains("stroke")', html).each(function () {
                const title = $(this).text().trim();
                const relativeUrl = $(this).attr('href');
                const absoluteUrl = baseUrls[journal.name] + relativeUrl;

                articles.push({
                    title: title,
                    url: absoluteUrl,
                    source: journal.name
                });
            });

            //Use Cheerio to parse the HTML and extract pancreatitis article information.
            $('a:contains("pancreatitis")', html).each(function () {
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


//listen for any changes on port 3005
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));