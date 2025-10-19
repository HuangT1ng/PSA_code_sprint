export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'psa_sentinel',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  ai: {
    serviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:5000',
    apiKey: process.env.AI_API_KEY || ''
  },
  
  externalServices: {
    edi: {
      url: process.env.EDI_SERVICE_URL || 'https://edi.psa.com.sg',
      apiKey: process.env.EDI_API_KEY || ''
    },
    vesselRegistry: {
      url: process.env.VESSEL_REGISTRY_URL || 'https://registry.psa.com.sg',
      apiKey: process.env.VESSEL_API_KEY || ''
    },
    container: {
      url: process.env.CONTAINER_SERVICE_URL || 'https://container.psa.com.sg',
      apiKey: process.env.CONTAINER_API_KEY || ''
    }
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs'
  }
};

