// Add this to the VERY top of the first file loaded in your app
var apm = require('elastic-apm-node').start({

    // Override the service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'apm-server',
  
    // Use if APM Server requires a secret token
    // secretToken: '',
  
    // Set the custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://apm-server:8200',
  
    // Set the service environment
    //environment: 'production'
  })

// Get/Load main config file
const config = require('./config/config')

// Import NPM modules
const express = require('express')
const logger = require('./utils/logger') // Winston logger
const morgan = require('morgan') // Morgan HTTP request logger
const morganEcsFormat = require('@elastic/ecs-morgan-format')

// Get route handlers
const bmiRouteHandler = require('./api/routes/bmi')
const promMetricsRouteHandler = require('./api/routes/prom-metrics')
const defaultRouteHandler = require('./api/middlewares/default')
const defaultErrorHandler = require('./api/middlewares/error')

// Express app
const app = express()

// Get ECS (Elastic Common Schema) format for morgan logging
app.use(morgan(morganEcsFormat()))

// Bind custom middleware/route handlers
app.use(bmiRouteHandler)
app.use(promMetricsRouteHandler)

// Default route and default error handler
app.use(defaultRouteHandler)
app.use(defaultErrorHandler)

// Server listening on certain port depending on the environment variable or CLI arg
app.listen(config.app.port, () => {
 logger.info(`Server is listening on port ${config.app.port}`)
})

module.exports = app