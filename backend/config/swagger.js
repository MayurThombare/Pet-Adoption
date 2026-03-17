const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🐾 PawsHome - Pet Adoption API',
      version: '1.0.0',
      description: `
## Pet Adoption Management System REST API

Built with Node.js + Express + PostgreSQL

### Demo Credentials
- **Admin:** admin@petadopt.com / admin123
- **User:** user@petadopt.com / user123

### How to Authenticate
1. Use **POST /api/auth/login** to get a token
2. Click the **Authorize** button (🔒) at the top
3. Enter: \`Bearer YOUR_TOKEN_HERE\`
4. All protected endpoints will now work
      `,
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://pet-adoption-backend-ugpm.onrender.com'
          : `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token. Get it from POST /api/auth/login',
        },
      },
      schemas: {
        // ── USER ──
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            role: { type: 'string', enum: ['visitor', 'user', 'admin'], example: 'user' },
            phone: { type: 'string', example: '+1234567890' },
            address: { type: 'string', example: '123 Main St, Springfield' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe', minLength: 2, maxLength: 100 },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123', minLength: 6 },
            phone: { type: 'string', example: '+1234567890' },
            address: { type: 'string', example: '123 Main St' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@petadopt.com' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        // ── PET ──
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
            name: { type: 'string', example: 'Buddy' },
            species: { type: 'string', enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'], example: 'dog' },
            breed: { type: 'string', example: 'Golden Retriever' },
            age: { type: 'number', example: 2 },
            ageUnit: { type: 'string', enum: ['months', 'years'], example: 'years' },
            gender: { type: 'string', enum: ['male', 'female', 'unknown'], example: 'male' },
            size: { type: 'string', enum: ['small', 'medium', 'large', 'extra-large'], example: 'large' },
            color: { type: 'string', example: 'Golden' },
            description: { type: 'string', example: 'Friendly and playful dog who loves fetch.' },
            status: { type: 'string', enum: ['available', 'pending', 'adopted'], example: 'available' },
            photoUrl: { type: 'string', example: 'https://images.unsplash.com/photo-xxx' },
            vaccinated: { type: 'boolean', example: true },
            neutered: { type: 'boolean', example: false },
            healthNotes: { type: 'string', example: 'All vaccinations up to date.' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        PetInput: {
          type: 'object',
          required: ['name', 'species', 'age'],
          properties: {
            name: { type: 'string', example: 'Buddy' },
            species: { type: 'string', enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'], example: 'dog' },
            breed: { type: 'string', example: 'Golden Retriever' },
            age: { type: 'number', example: 2 },
            ageUnit: { type: 'string', enum: ['months', 'years'], example: 'years' },
            gender: { type: 'string', enum: ['male', 'female', 'unknown'], example: 'male' },
            size: { type: 'string', enum: ['small', 'medium', 'large', 'extra-large'], example: 'large' },
            color: { type: 'string', example: 'Golden' },
            description: { type: 'string', example: 'Friendly and playful dog.' },
            status: { type: 'string', enum: ['available', 'pending', 'adopted'], example: 'available' },
            photoUrl: { type: 'string', example: 'https://example.com/photo.jpg' },
            vaccinated: { type: 'boolean', example: true },
            neutered: { type: 'boolean', example: false },
            healthNotes: { type: 'string', example: 'Healthy, no issues.' },
          },
        },
        PetsListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                pets: { type: 'array', items: { $ref: '#/components/schemas/Pet' } },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 12 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 12 },
                    totalPages: { type: 'integer', example: 1 },
                  },
                },
              },
            },
          },
        },
        // ── APPLICATION ──
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            petId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending' },
            message: { type: 'string', example: 'I would love to adopt this pet!' },
            homeType: { type: 'string', enum: ['house', 'apartment', 'condo', 'other'], example: 'house' },
            hasYard: { type: 'boolean', example: true },
            hasChildren: { type: 'boolean', example: false },
            hasOtherPets: { type: 'boolean', example: false },
            experience: { type: 'string', example: 'I have owned dogs before.' },
            adminNotes: { type: 'string', example: 'Great applicant!' },
            reviewedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            pet: { $ref: '#/components/schemas/Pet' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        ApplicationInput: {
          type: 'object',
          required: ['petId'],
          properties: {
            petId: { type: 'string', format: 'uuid', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
            message: { type: 'string', example: 'I would love to adopt this pet!' },
            homeType: { type: 'string', enum: ['house', 'apartment', 'condo', 'other'], example: 'house' },
            hasYard: { type: 'boolean', example: true },
            hasChildren: { type: 'boolean', example: false },
            hasOtherPets: { type: 'boolean', example: false },
            otherPetsDescription: { type: 'string', example: 'One cat, very friendly.' },
            experience: { type: 'string', example: 'Had dogs for 5 years.' },
          },
        },
        ReviewInput: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['approved', 'rejected'], example: 'approved' },
            adminNotes: { type: 'string', example: 'Great applicant, approved!' },
          },
        },
        // ── COMMON ──
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message here' },
          },
        },
      },
    },
    // ── ALL PATHS DEFINED INLINE ──
    paths: {
      // ── AUTH ──
      '/api/auth/register': {
        post: {
          tags: ['🔐 Auth'],
          summary: 'Register a new user',
          description: 'Creates a new user account and returns a JWT token.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
          },
          responses: {
            201: { description: 'Registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['🔐 Auth'],
          summary: 'Login with email and password',
          description: 'Returns a JWT token. Use this token in the Authorize button above.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['🔐 Auth'],
          summary: 'Get current user profile',
          description: 'Returns the profile of the currently authenticated user.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } } } } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/auth/profile': {
        put: {
          tags: ['🔐 Auth'],
          summary: 'Update user profile',
          description: 'Update name, phone, and address of the logged-in user.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Updated Name' },
                    phone: { type: 'string', example: '+9876543210' },
                    address: { type: 'string', example: '456 New Street' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Profile updated successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      // ── PETS ──
      '/api/pets': {
        get: {
          tags: ['🐾 Pets'],
          summary: 'Get all pets (public)',
          description: 'Returns paginated list of pets. Supports search, filter, sort. No authentication required.',
          parameters: [
            { name: 'search', in: 'query', description: 'Search by name or breed', schema: { type: 'string' }, example: 'Buddy' },
            { name: 'species', in: 'query', description: 'Filter by species', schema: { type: 'string', enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'] } },
            { name: 'breed', in: 'query', description: 'Filter by breed (partial match)', schema: { type: 'string' }, example: 'Retriever' },
            { name: 'age', in: 'query', description: 'Filter by age range', schema: { type: 'string', enum: ['0-1', '1-3', '3-7', '7-100'] } },
            { name: 'status', in: 'query', description: 'Filter by status (default: available)', schema: { type: 'string', enum: ['available', 'pending', 'adopted'] } },
            { name: 'sort', in: 'query', description: 'Sort field', schema: { type: 'string', enum: ['createdAt', 'name', 'age'], default: 'createdAt' } },
            { name: 'order', in: 'query', description: 'Sort order', schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' } },
            { name: 'page', in: 'query', description: 'Page number', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', description: 'Items per page', schema: { type: 'integer', default: 12 } },
          ],
          responses: {
            200: { description: 'List of pets with pagination', content: { 'application/json': { schema: { $ref: '#/components/schemas/PetsListResponse' } } } },
          },
        },
        post: {
          tags: ['🐾 Pets'],
          summary: 'Create a new pet (Admin only)',
          description: 'Add a new pet to the system. Requires admin role.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PetInput' } } },
          },
          responses: {
            201: { description: 'Pet created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { pet: { $ref: '#/components/schemas/Pet' } } } } } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
          },
        },
      },
      '/api/pets/{id}': {
        get: {
          tags: ['🐾 Pets'],
          summary: 'Get a single pet by ID (public)',
          description: 'Returns full details of a pet. No authentication required.',
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Pet UUID', schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Pet details', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { pet: { $ref: '#/components/schemas/Pet' } } } } } } } },
            404: { description: 'Pet not found' },
          },
        },
        put: {
          tags: ['🐾 Pets'],
          summary: 'Update a pet (Admin only)',
          description: 'Update pet information. Requires admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Pet UUID', schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PetInput' } } },
          },
          responses: {
            200: { description: 'Pet updated' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
            404: { description: 'Pet not found' },
          },
        },
        delete: {
          tags: ['🐾 Pets'],
          summary: 'Delete a pet (Admin only)',
          description: 'Permanently delete a pet. Requires admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Pet UUID', schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Pet deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
            404: { description: 'Pet not found' },
          },
        },
      },
      '/api/pets/{id}/status': {
        patch: {
          tags: ['🐾 Pets'],
          summary: 'Update pet status (Admin only)',
          description: 'Quickly update just the status of a pet.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Pet UUID', schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: { status: { type: 'string', enum: ['available', 'pending', 'adopted'], example: 'available' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status updated' },
            400: { description: 'Invalid status' },
            403: { description: 'Forbidden — Admin only' },
          },
        },
      },
      // ── APPLICATIONS ──
      '/api/applications': {
        get: {
          tags: ['📋 Applications'],
          summary: 'Get all applications (Admin only)',
          description: 'Returns all adoption applications across all users. Requires admin role.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } },
            { name: 'petId', in: 'query', description: 'Filter by pet UUID', schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'All applications with pagination' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
          },
        },
        post: {
          tags: ['📋 Applications'],
          summary: 'Submit adoption application (User)',
          description: 'Apply to adopt a pet. Pet must be "available". Cannot apply twice for the same pet.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplicationInput' } } },
          },
          responses: {
            201: { description: 'Application submitted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { type: 'object', properties: { application: { $ref: '#/components/schemas/Application' } } } } } } } },
            400: { description: 'Pet not available' },
            401: { description: 'Unauthorized' },
            409: { description: 'Already applied for this pet' },
          },
        },
      },
      '/api/applications/my': {
        get: {
          tags: ['📋 Applications'],
          summary: 'Get my applications (User)',
          description: 'Get all adoption applications submitted by the currently logged-in user.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } },
          ],
          responses: {
            200: { description: 'User applications with pagination' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/applications/{id}': {
        get: {
          tags: ['📋 Applications'],
          summary: 'Get single application',
          description: 'Users can only view their own. Admins can view any.',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Application UUID', schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Application details' },
            401: { description: 'Unauthorized' },
            403: { description: 'Access denied' },
            404: { description: 'Application not found' },
          },
        },
      },
      '/api/applications/{id}/review': {
        patch: {
          tags: ['📋 Applications'],
          summary: 'Approve or reject application (Admin only)',
          description: `Review a pending adoption application.
          
**On Approval:**
- Pet status → "adopted"
- All other pending applications for that pet → auto-rejected

**On Rejection:**
- If no other pending applications → pet status returns to "available"`,
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, description: 'Application UUID', schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewInput' } } },
          },
          responses: {
            200: { description: 'Application reviewed successfully' },
            400: { description: 'Only pending applications can be reviewed' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — Admin only' },
            404: { description: 'Application not found' },
          },
        },
      },
      // ── HEALTH ──
      '/api/health': {
        get: {
          tags: ['⚙️ System'],
          summary: 'Health check',
          description: 'Check if the API is running.',
          responses: {
            200: { description: 'API is running', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Pet Adoption API is running' }, timestamp: { type: 'string', format: 'date-time' } } } } } },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
