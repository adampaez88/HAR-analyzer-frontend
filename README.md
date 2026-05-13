# HAR Analyzer Frontend
Frontend application for the HAR Analyzer platform.

This application provides a modern UI for comparing HAR (HTTP Archive) files and visualizing request-level differences including headers, cookies, payloads, responses, and timing metrics.

The frontend is architected around a normalized adapter layer to ensure scalability, maintainability, and future AI-readiness.


# 🚀 Live Demo
Frontend Deployment:
https://har-analyzer-frontend-sepia.vercel.app/

Backend API:
https://har-analyzer-backend-hkyx.onrender.com


# 🏗️ Frontend Architecture
The frontend intentionally separates:
- backend response contracts
- normalization logic
- presentation logic

Architecture ownership:
- Backend owns truth
- Adapter owns normalization
- UI owns presentation
- AI owns interpretation

🧠 Adapter Layer
The frontend uses a dedicated normalization layer: src/adapters/diffAdapter.ts

This layer transforms backend diff responses into stable UI-friendly contracts.

Benefits
- prevents UI/backend tight coupling
- improves maintainability
- simplifies future backend changes
- prepares system for AI integrations
- improves rendering consistency

⚙️ Tech Stack
- React
- TypeScript
- Vite
- Fetch API
- Recharts
- Vercel

✨ Features
HAR Comparison
- upload two HAR files
- compare network traffic sessions
- analyze request-level differences

Request Diffing
Supports:
- request headers
- request body
- cookies
- response headers
- response cookies

Timing Analysis
Visualizes:
- wait timing
- receive timing
- total timing
- timing deltas
- UI Features
- endpoint drawer
- filtering
- searching
- diff summaries
- export functionality
- deterministic rendering
- malformed data safety

📂 Project Structure
src/
├── adapters/
├── api/
├── components/
├── styles/
├── types/
├── utils/

🔧 Environment Variables
Create:
.env.local

Example:
VITE_API_BASE_URL=http://localhost:3000

Production example:
VITE_API_BASE_URL=https://your-backend-url.onrender.com

🛠️ Local Development
Install dependencies:
    $ npm install

Run development server:
    $ npm run dev

Build production bundle:
    $ npm run build


🚀 Deployment
Frontend is deployed using Vercel

Production Build
Vite production builds are generated with:
    $ npm run build

🧪 Current Stability Goals
The frontend prioritizes:
- deterministic rendering
- normalized state contracts
- scalable architecture
- backend decoupling
- future AI compatibility

🚀 Planned Frontend Improvements
UI/UX
- nested JSON expand/collapse
- advanced filtering
- loading skeletons
- upload progress indicators
- better empty states
- improved error messaging

Performance
- virtualization for large HAR files
- web worker processing
- memoization optimization

Visualization
- request timeline charts
- waterfall visualizations
- expanded timing analytics

AI Readiness
- AI-generated summaries
- anomaly highlighting
- intelligent diff explanations

Developer Experience
- automated testing
- Storybook integration
- improved type safety
- CI/CD pipeline integration

🛡️ Error Handling Goals
Future improvements include:
- categorized upload errors
- malformed HAR detection
- retry-safe frontend requests
- timeout handling
- better network failure messaging

📈 Long-Term Vision
HAR Analyzer is being designed as:
    an actively evolving production-grade HAR analysis platform

Future roadmap areas include:
- AI-powered diff interpretation
- performance regression detection
- session persistence
- collaboration/sharing
- advanced analytics

👨‍💻 Author
Adam Chernitsky
GitHub: https://github.com/adampaez88
Portfolio: https://studio--studio-6412533934-88d88.us-central1.hosted.app/