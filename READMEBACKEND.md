# Development (with hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run built version
npm start

# Type checking only
npm run type-check

# Clean build folder
npm run clean


backend/
├── app.ts                    # Main server (TypeScript)
├── tsconfig.json            # TypeScript config
├── nodemon.json             # Development config
├── package.json             # Dependencies & scripts
├── controller/
│   └── Auth/
│       └── handleSignup.ts  # Signup controller
├── router/
│   └── Auth/
│       └── userSignUp.ts    # Auth routes
├── prisma/                  # Database schema
└── dist/                    # Built JavaScript (after build)