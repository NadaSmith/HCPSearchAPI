const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const redis = requier('redis');
const client = redis.createClient();



const app = express();
const port = process.env.PORT || 3000; 

// Define your middleware here

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(bodyParser.json());
app.use('/providers/search', limiter);

client.on('error', (error) => {
    console.error('Redis Error:', error);
})

// Function to fetch provider data from the NPI API with caching
async function fetchProviderDataFromNPI(searchParams) {
    const cacheKey = JSON.stringify(searchParams);
  
    // Check if the data is cached
    client.get(cacheKey, async (err, cachedData) => {
      if (err) {
        console.error('Redis Cache Error:', err);
      }
  
      if (cachedData) {
        // Data is in the cache, return it
        return JSON.parse(cachedData);
      } else {
        try {
          const response = await axios.get('https://npiregistry.cms.hhs.gov/api/?version=2.1', {
            params: searchParams,
          });
  
          // Store the data in the cache for future use (with an expiration time, if needed)
          client.setex(cacheKey, 3600, JSON.stringify(response.data)); // Cache data for 1 hour
  
          return response.data;
        } catch (error) {
          // Handle errors from the NPI API
          if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data || 'NPI API error';
  
            // Respond with an appropriate status code and error message
            return { error: errorMessage, status: statusCode };
          } else {
            // Handle other types of errors, such as network issues
            throw error;
          }
        }
      }
    });
}

// Function to validate and sanitize page and pageSize values
function validatePaginationParams(page, pageSize) {
    // Ensure page and pageSize are positive integers
    page = parseInt(page);
    pageSize = parseInt(pageSize);
  
    if (isNaN(page) || page <= 0) {
      page = 1; // Default to page 1 if page is invalid
    }
  
    if (isNaN(pageSize) || pageSize <= 0) {
      pageSize = 10; // Default to pageSize 10 if pageSize is invalid
    }
  
    return { page, pageSize };
}

// Function to validate search parameters
function validateSearchParams(params) {
    const errors = {};
  
    // Validate age
    if (params.age !== undefined) {
        const age = parseInt(params.age);
        if (isNaN(age) || age < 0) {
            errors.age = 'Age must be a positive integer';
        }
    }
  
    // Validate gender 
    if (params.gender !== undefined) {
        const gender = ['Male', 'Female', 'Nonbinary'];
        if (!gender.includes(params.gender)) {
          errors.gender = 'Gender must be one of: Male, Female, Nonbinary';
        }
    }

    // Validate race 
    if (params.race !== undefined && params.race.trim() === '') {
        errors.race = 'Race must be a non-empty string';
        }
    }

    // Validate language 
    if (params.language !== undefined) {
        const language = parseInt(params.language);
        if (!Array.isArray(params.language) || params.language.some(lang => typeof lang !== "string" || lang.trim() == '')) {
          errors.language = 'Language must be an array of non-empty strings';
        }
    }

    // Validate insurance
    if (params.insurance !== undefined) {
        if (!Array.isArray(params.insurance) || params.insurance.some(ins => typeof ins !== 'string' || ins.trim() === '')) {
          errors.insurance = 'Insurance must be an array of non-empty strings';
        }
    }

    // Validate city
    if (params.city !== undefined) {
        const city = parseInt(params.city);
        if (isNaN(city) || city < 0) {
          errors.city = 'City must be a positive integer';
        }
    }

    // Validate state 
    if (params.state !== undefined) {
        const state = parseInt(params.state);
        if (isNaN(state) || state < 0) {
          errors.state = 'State must be a positive integer';
        }
    }
    
    return errors;
};



// Define your routes to search for providers based on custom criteria
app.get('/providers',   (req, res) => {
    // Handle the GET request, filter providers, and return the results as JSON
    const { age, race, gender, language, state, city, insurance } = 
    req.query;
    
    // Implement filtering logic here based on query parameters
    let filteredProviders = providers;

    // Implement similar filters for age
    if (age) {
        filteredProviders = filteredProviders.filter(provider => provider.age === parseInt(age));
    }

    // Implement similar filters for race
    if (race) {
        filteredProviders = filteredProviders.filter(provider => provider.race === race);
    }

    // Implement similar filters for gender
    if (gender) {
        filteredProviders = filteredProviders.filter(provider => provider.gender === gender);
    }

    // Implement similar filters for language
    if (language) {
        filteredProviders = filteredProviders.filter(provider => provider.language === language);
    }

    // Implement similar filters for sex, languages, and insurance
    if (insurance) {
        filteredProviders = filteredProviders.filter(provider => provider.insurance === insurance);
    }

    // Implement similar filters for state
    if (state) {
        filteredProviders = filteredProviders.filter(provider => provider.location.state === state);
    }
    
    // Implement similar filters for city
    if (city) {
        filteredProviders = filteredProviders.filter(provider => provider.location.city === city);
    }

    res.json(filteredProviders);
});

// Define a route to search for healthcare providers based on custom criteria
app.get('/providers/search', async (req, res) => {
    const searchParams = req.query; // Extract search parameters from the query string
  
    // Validate search parameters
    const validationErrors = validateSearchParams(searchParams);

    if (Object.keys(validationErrors).length > 0) {
        // Return validation errors to the client
        return res.status(400).json({ errors: validationErrors });
    }

    try {
      // Fetch provider data from the NPI API based on the search parameters
      const providerData = await fetchProviderDataFromNPI(searchParams);
  
      // Check if the NPI API returned an error
      if (providerData.error) {
        res.status(providerData.status || 500).json({ error: providerData.error });
      } else {
        // Return the provider data along with pagination information to the client
        const totalResults = providerData.result_count || 0;
        const totalPages = Math.ceil(totalResults / validatedPageSize);

        res.json({
            results: providerData.results,
            page: validatedPage,
            pageSize: validatedPageSize,
            totalResults,
            totalPages,
        });
        }
    } catch (error) {
      // Handle other potential errors, such as validation errors or network issues
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
});
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
