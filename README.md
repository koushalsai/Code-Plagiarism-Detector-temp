# Code Plagiarism Detector

A powerful plagiarism detection tool for code snippets using the MOSS Winnowing algorithm with language-specific optimizations and PostgreSQL database storage.

## Features

- **Advanced Plagiarism Detection**: Uses the MOSS Winnowing algorithm for accurate similarity analysis
- **Multi-Language Support**: Supports JavaScript, Python, Java, C++, and C#
- **Language-Specific Tokenization**: Preserves important syntax structures while normalizing variables
- **Variable Renaming Detection**: Identifies plagiarism even when variable names are changed
- **Persistent Storage**: PostgreSQL database for storing analysis results
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Analysis**: Fast processing with detailed similarity metrics

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Algorithm**: MOSS Winnowing with language-specific optimizations

## Prerequisites

Before running this project locally, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local installation or cloud service)
- **VS Code** (recommended IDE)

## Local Setup Instructions

### 1. Clone or Download the Project

```bash
# If you have the project as a zip file, extract it
# If using git:
git clone <your-repository-url>
cd code-plagiarism-detector
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE plagiarism_detector;
```

#### Option B: Cloud PostgreSQL (Recommended)
- Use services like Supabase, Neon, or Railway
- Get your connection string from the provider

##### Supabase Setup Steps
1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project and choose a name, password, and region.
3. Once the project is created, go to the **Database** section and note your **connection string** (found under Project Settings > Database > Connection string).
4. In the SQL editor, run:
   ```sql
   CREATE DATABASE plagiarism_detector;
   ```
   (If not allowed, use the default database provided by Supabase.)
5. In your project's `.env` file, set `DATABASE_URL` to your Supabase connection string. It should look like:
   ```env
   DATABASE_URL="postgresql://postgres:<your-password>@<host>:<port>/<database>"
   ```
6. Make sure your IP is allowed in the Supabase database settings (Project Settings > Database > Connection Pooling > Allowed IP addresses).
7. Continue with the migration and setup steps below.

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/plagiarism_detector"

# PostgreSQL Connection Details (if using separate configs)
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=plagiarism_detector
```

**Replace the values with your actual database credentials.**

### 5. Database Migration

Push the schema to your database:

```bash
npm run db:push
```

### 6. Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

## VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best development experience:

1. **TypeScript and JavaScript Language Features** (built-in)
2. **ES7+ React/Redux/React-Native snippets**
3. **Tailwind CSS IntelliSense**
4. **Prettier - Code formatter**
5. **ESLint**
6. **Auto Rename Tag**
7. **Bracket Pair Colorizer**
8. **PostgreSQL** (for database management)

### VS Code Configuration

Create a `.vscode/settings.json` file in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── ui/         # UI subcomponents (buttons, dialogs, etc.)
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic (MOSS algorithm)
│   ├── utils/              # Helper functions and tokenizers
│   ├── db.ts               # Database connection
│   ├── storage.ts          # Data access layer
│   └── routes.ts           # API routes
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and validation
├── migrations/             # Database migration files
│   ├── 0000_panoramic_true_believers.sql
│   └── meta/               # Migration metadata
├── package.json
├── drizzle.config.ts       # Database configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
├── postcss.config.js       # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Usage Guide

### Basic Plagiarism Detection

1. **Select Programming Language**: Choose from JavaScript, Python, Java, C++, or C#
2. **Enter Code Samples**: Paste your code snippets in both editors
3. **Run Analysis**: Click "Check Plagiarism" to start the analysis
4. **Review Results**: Examine the similarity percentage and detailed metrics

### Understanding Results

- **Similarity Percentage**: Overall plagiarism score (0-100%)
- **Structural Similarity**: How similar the code structure is
- **Control Flow**: Similarity in if/else, loops, etc.
- **Logic Patterns**: Similarity in operators and logical constructs
- **Variable Renaming**: Whether variable names were changed
- **Matching Segments**: Specific code sections that match

## Algorithm Details

The MOSS Winnowing algorithm works through these steps:

1. **Tokenization**: Language-specific parsing that preserves syntax
2. **K-gram Generation**: Creates overlapping token sequences
3. **Fingerprinting**: Uses rolling hash windows to create fingerprints
4. **Similarity Calculation**: Compares fingerprints using Jaccard similarity
5. **Pattern Analysis**: Detects structural and logical similarities

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -h localhost -U your_username -d plagiarism_detector
```

### Common Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Environment Variables

Ensure your `.env` file is in the project root and contains valid database credentials.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request



## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify your database connection
4. Check the console for error messages

For additional help, please open an issue in the repository.
