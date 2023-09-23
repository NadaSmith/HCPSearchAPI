const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000; 

// Define your middleware here
app.use(bodyParser.json());

const NPI_API_URL = 'https://npiregistry.cms.hhs.gov/api/?version=2.1';

// Function to fetch provider data from the NPI API with pagination
async function fetchProviderDataFromNPI(searchParams, page = 1, pageSize = 10) {
    try {
      // Add pagination parameters to the searchParams
      searchParams.limit = pageSize;
      searchParams.skip = (page - 1) * pageSize;
  
      const response = await axios.get('https://npiregistry.cms.hhs.gov/api/?version=2.1', {
        params: searchParams,
      });
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
