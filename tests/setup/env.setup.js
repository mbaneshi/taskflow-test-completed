/**
 * Environment Setup for Tests
 * 
 * Configures environment variables and global settings for testing.
 * Sets up test database, API endpoints, and mock services.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Set test database URI
process.env.MONGODB_URI = 'mongodb://localhost:27017/taskflow-test';

// Set test JWT secret
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

// Set test port
process.env.PORT = '5001';

// Set test API base URL
process.env.API_BASE_URL = 'http://localhost:5001/api';

// Set test timeout
process.env.TEST_TIMEOUT = '30000';

// Set test logging level
process.env.LOG_LEVEL = 'error';

// Disable console logging in tests
process.env.DISABLE_LOGGING = 'true';

// Set test user credentials
process.env.TEST_USER_EMAIL = 'test@example.com';
process.env.TEST_USER_PASSWORD = 'testpassword123';
process.env.TEST_ADMIN_EMAIL = 'admin@example.com';
process.env.TEST_ADMIN_PASSWORD = 'adminpassword123';

// Set test database cleanup
process.env.CLEANUP_TEST_DB = 'true';

// Set test rate limiting
process.env.TEST_RATE_LIMIT = 'false';

// Set test CORS
process.env.TEST_CORS_ORIGIN = 'http://localhost:3000';

// Set test file upload
process.env.TEST_MAX_FILE_SIZE = '1048576'; // 1MB
process.env.TEST_UPLOAD_DIR = './test-uploads';

// Set test email
process.env.TEST_SMTP_HOST = 'localhost';
process.env.TEST_SMTP_PORT = '1025';
process.env.TEST_SMTP_USER = 'test@example.com';
process.env.TEST_SMTP_PASS = 'testpass';

// Set test session
process.env.TEST_SESSION_SECRET = 'test-session-secret';
process.env.TEST_SESSION_COOKIE_MAX_AGE = '3600000'; // 1 hour

// Set test security
process.env.TEST_BCRYPT_SALT_ROUNDS = '4'; // Lower for faster tests
process.env.TEST_JWT_EXPIRES_IN = '1h';

// Set test monitoring
process.env.TEST_ENABLE_MONITORING = 'false';
process.env.TEST_ENABLE_LOGGING = 'false';

// Set test performance
process.env.TEST_ENABLE_CACHING = 'false';
process.env.TEST_ENABLE_COMPRESSION = 'false';

// Set test database indexes
process.env.TEST_CREATE_INDEXES = 'false';

// Set test data seeding
process.env.TEST_SEED_DATA = 'true';
process.env.TEST_SEED_USERS = '5';
process.env.TEST_SEED_TASKS = '20';
process.env.TEST_SEED_LOGS = '50';

// Set test cleanup intervals
process.env.TEST_CLEANUP_INTERVAL = '1000'; // 1 second
process.env.TEST_MAX_CLEANUP_ATTEMPTS = '3';

// Set test validation
process.env.TEST_ENABLE_VALIDATION = 'true';
process.env.TEST_STRICT_MODE = 'false';

// Set test error handling
process.env.TEST_ENABLE_ERROR_HANDLING = 'true';
process.env.TEST_LOG_ERRORS = 'false';

// Set test authentication
process.env.TEST_ENABLE_AUTH = 'true';
process.env.TEST_ENABLE_ROLES = 'true';
process.env.TEST_ENABLE_SESSIONS = 'true';

// Set test database operations
process.env.TEST_ENABLE_DB_OPS = 'true';
process.env.TEST_ENABLE_TRANSACTIONS = 'false';
process.env.TEST_ENABLE_MIGRATIONS = 'false';

// Set test API endpoints
process.env.TEST_API_VERSION = 'v1';
process.env.TEST_API_PREFIX = '/api';
process.env.TEST_API_TIMEOUT = '5000';

// Set test middleware
process.env.TEST_ENABLE_CORS = 'true';
process.env.TEST_ENABLE_HELMET = 'false';
process.env.TEST_ENABLE_RATE_LIMIT = 'false';
process.env.TEST_ENABLE_COMPRESSION = 'false';

// Set test database models
process.env.TEST_ENABLE_MODELS = 'true';
process.env.TEST_ENABLE_SCHEMAS = 'true';
process.env.TEST_ENABLE_VALIDATION = 'true';

// Set test routes
process.env.TEST_ENABLE_ROUTES = 'true';
process.env.TEST_ENABLE_CONTROLLERS = 'true';
process.env.TEST_ENABLE_MIDDLEWARE = 'true';

// Set test utilities
process.env.TEST_ENABLE_UTILS = 'true';
process.env.TEST_ENABLE_HELPERS = 'true';
process.env.TEST_ENABLE_CONSTANTS = 'true';

// Set test configuration
process.env.TEST_ENABLE_CONFIG = 'true';
process.env.TEST_ENABLE_SETTINGS = 'true';
process.env.TEST_ENABLE_ENV = 'true';

// Set test database connection
process.env.TEST_DB_CONNECTION_TIMEOUT = '5000';
process.env.TEST_DB_QUERY_TIMEOUT = '10000';
process.env.TEST_DB_POOL_SIZE = '5';

// Set test JWT settings
process.env.TEST_JWT_ALGORITHM = 'HS256';
process.env.TEST_JWT_ISSUER = 'taskflow-test';
process.env.TEST_JWT_AUDIENCE = 'taskflow-test-users';

// Set test password settings
process.env.TEST_PASSWORD_MIN_LENGTH = '6';
process.env.TEST_PASSWORD_REQUIRE_UPPERCASE = 'false';
process.env.TEST_PASSWORD_REQUIRE_LOWERCASE = 'false';
process.env.TEST_PASSWORD_REQUIRE_NUMBERS = 'false';
process.env.TEST_PASSWORD_REQUIRE_SPECIAL = 'false';

// Set test user settings
process.env.TEST_USERNAME_MIN_LENGTH = '3';
process.env.TEST_USERNAME_MAX_LENGTH = '30';
process.env.TEST_EMAIL_MAX_LENGTH = '100';

// Set test task settings
process.env.TEST_TASK_TITLE_MIN_LENGTH = '3';
process.env.TEST_TASK_TITLE_MAX_LENGTH = '100';
process.env.TEST_TASK_DESCRIPTION_MIN_LENGTH = '10';
process.env.TEST_TASK_DESCRIPTION_MAX_LENGTH = '500';

// Set test log settings
process.env.TEST_LOG_RETENTION_DAYS = '30';
process.env.TEST_LOG_MAX_SIZE = '10485760'; // 10MB
process.env.TEST_LOG_LEVEL = 'info';

// Set test performance thresholds
process.env.TEST_MAX_RESPONSE_TIME = '1000'; // 1 second
process.env.TEST_MAX_DB_QUERY_TIME = '500'; // 500ms
process.env.TEST_MAX_MEMORY_USAGE = '104857600'; // 100MB

// Set test security thresholds
process.env.TEST_MAX_LOGIN_ATTEMPTS = '5';
process.env.TEST_LOGIN_LOCKOUT_TIME = '900000'; // 15 minutes
process.env.TEST_SESSION_MAX_AGE = '86400000'; // 24 hours

// Set test data limits
process.env.TEST_MAX_TASKS_PER_USER = '100';
process.env.TEST_MAX_LOGS_PER_USER = '1000';
process.env.TEST_MAX_COMMENTS_PER_TASK = '50';

// Set test file limits
process.env.TEST_MAX_FILE_SIZE = '5242880'; // 5MB
process.env.TEST_MAX_FILES_PER_TASK = '10';
process.env.TEST_ALLOWED_FILE_TYPES = 'image/jpeg,image/png,application/pdf';

// Set test notification settings
process.env.TEST_ENABLE_EMAIL_NOTIFICATIONS = 'false';
process.env.TEST_ENABLE_PUSH_NOTIFICATIONS = 'false';
process.env.TEST_ENABLE_SMS_NOTIFICATIONS = 'false';

// Set test analytics settings
process.env.TEST_ENABLE_ANALYTICS = 'false';
process.env.TEST_ENABLE_TRACKING = 'false';
process.env.TEST_ENABLE_METRICS = 'false';

// Set test backup settings
process.env.TEST_ENABLE_BACKUPS = 'false';
process.env.TEST_BACKUP_INTERVAL = '86400000'; // 24 hours
process.env.TEST_BACKUP_RETENTION = '7'; // 7 days

// Set test monitoring settings
process.env.TEST_ENABLE_HEALTH_CHECKS = 'true';
process.env.TEST_ENABLE_STATUS_ENDPOINTS = 'true';
process.env.TEST_ENABLE_METRICS_ENDPOINTS = 'false';

// Set test development settings
process.env.TEST_ENABLE_HOT_RELOAD = 'false';
process.env.TEST_ENABLE_DEBUG_MODE = 'true';
process.env.TEST_ENABLE_VERBOSE_LOGGING = 'false';

// Set test production settings
process.env.TEST_ENABLE_SSL = 'false';
process.env.TEST_ENABLE_HTTPS = 'false';
process.env.TEST_ENABLE_CDN = 'false';

// Set test deployment settings
process.env.TEST_ENABLE_DOCKER = 'false';
process.env.TEST_ENABLE_KUBERNETES = 'false';
process.env.TEST_ENABLE_CI_CD = 'false';

// Set test external services
process.env.TEST_ENABLE_EXTERNAL_APIS = 'false';
process.env.TEST_ENABLE_THIRD_PARTY_SERVICES = 'false';
process.env.TEST_ENABLE_WEBHOOKS = 'false';

// Set test integration settings
process.env.TEST_ENABLE_INTEGRATION_TESTS = 'true';
process.env.TEST_ENABLE_E2E_TESTS = 'false';
process.env.TEST_ENABLE_PERFORMANCE_TESTS = 'false';

// Set test coverage settings
process.env.TEST_COVERAGE_THRESHOLD = '80';
process.env.TEST_COVERAGE_REPORTERS = 'text,lcov,html';
process.env.TEST_COVERAGE_DIRECTORY = 'coverage';

// Set test reporting settings
process.env.TEST_REPORT_FORMAT = 'junit';
process.env.TEST_REPORT_OUTPUT = 'test-results.xml';
process.env.TEST_REPORT_VERBOSE = 'true';

// Set test parallelization settings
process.env.TEST_MAX_WORKERS = '1';
process.env.TEST_ENABLE_PARALLEL = 'false';
process.env.TEST_WORKER_TIMEOUT = '30000';

// Set test retry settings
process.env.TEST_MAX_RETRIES = '3';
process.env.TEST_RETRY_DELAY = '1000';
process.env.TEST_RETRY_BACKOFF = '2';

// Set test timeout settings
process.env.TEST_DEFAULT_TIMEOUT = '5000';
process.env.TEST_LONG_TIMEOUT = '30000';
process.env.TEST_SHORT_TIMEOUT = '1000';

// Set test assertion settings
process.env.TEST_STRICT_ASSERTIONS = 'false';
process.env.TEST_ENABLE_CUSTOM_MATCHERS = 'true';
process.env.TEST_ENABLE_ASYNC_ASSERTIONS = 'true';

// Set test mock settings
process.env.TEST_ENABLE_MOCKS = 'true';
process.env.TEST_ENABLE_STUBS = 'true';
process.env.TEST_ENABLE_SPIES = 'true';

// Set test fixture settings
process.env.TEST_ENABLE_FIXTURES = 'true';
process.env.TEST_FIXTURE_DIRECTORY = './tests/fixtures';
process.env.TEST_FIXTURE_FORMAT = 'json';

// Set test database settings
process.env.TEST_DB_NAME = 'taskflow-test';
process.env.TEST_DB_HOST = 'localhost';
process.env.TEST_DB_PORT = '27017';
process.env.TEST_DB_USERNAME = '';
process.env.TEST_DB_PASSWORD = '';

// Set test server settings
process.env.TEST_SERVER_HOST = 'localhost';
process.env.TEST_SERVER_PORT = '5001';
process.env.TEST_SERVER_PROTOCOL = 'http';

// Set test client settings
process.env.TEST_CLIENT_HOST = 'localhost';
process.env.TEST_CLIENT_PORT = '3000';
process.env.TEST_CLIENT_PROTOCOL = 'http';

// Set test API settings
process.env.TEST_API_HOST = 'localhost';
process.env.TEST_API_PORT = '5001';
process.env.TEST_API_PROTOCOL = 'http';
process.env.TEST_API_BASE_PATH = '/api';

// Set test database connection string
process.env.TEST_MONGODB_URI = `mongodb://${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}/${process.env.TEST_DB_NAME}`;

// Set test server URL
process.env.TEST_SERVER_URL = `${process.env.TEST_SERVER_PROTOCOL}://${process.env.TEST_SERVER_HOST}:${process.env.TEST_SERVER_PORT}`;

// Set test client URL
process.env.TEST_CLIENT_URL = `${process.env.TEST_CLIENT_PROTOCOL}://${process.env.TEST_CLIENT_HOST}:${process.env.TEST_CLIENT_PORT}`;

// Set test API URL
process.env.TEST_API_URL = `${process.env.TEST_API_PROTOCOL}://${process.env.TEST_API_HOST}:${process.env.TEST_API_PORT}${process.env.TEST_API_BASE_PATH}`;

console.log('✅ Test environment configured successfully');
console.log(`📊 Test Database: ${process.env.TEST_MONGODB_URI}`);
console.log(`🚀 Test Server: ${process.env.TEST_SERVER_URL}`);
console.log(`🌐 Test Client: ${process.env.TEST_CLIENT_URL}`);
console.log(`🔌 Test API: ${process.env.TEST_API_URL}`);
