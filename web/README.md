# Markify Web

Web application that extracts clean, structured markdown from any URL. It provides a simple and intuitive interface for
users to convert web content to markdown format.

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

![screenshot.png](public/screenshot.png)

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- markify-ts

## API

The application exposes a simple API endpoint:

```
GET /api/markify?url=<url>
```

Returns markdown extracted from the provided URL.

## License

MIT