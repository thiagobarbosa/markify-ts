# Markify

Typescript library to seamlessly convert web pages
and HTML snippets into well-structured Markdown content.

## Features

- Convert web pages to Markdown from a URL
- Convert raw HTML strings to Markdown
- Ignore specific elements by providing a list of HTML selectors
- Command line interface
- Next.js web interface for easy URL-to-Markdown conversion

## Library Installation

```bash
npm install markify
```

## Web Application Usage

The project now includes a Next.js 14 web application that allows you to convert URLs to Markdown with a simple UI.

### Setup and Run the Web Application

```bash
# Clone the repository
git clone "https://github.com/thiagobarbosa/markify-ts.git"
cd markify

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit http://localhost:3000 to use the application.

### Web Application Features

- Clean, responsive interface with light/dark mode
- Input any URL to convert to Markdown
- Copy or download the generated Markdown with a click
- Smooth animations using Framer Motion
- Built with Next.js 14, TypeScript, and Tailwind CSS

### Customizing the Theme

You can easily customize the color palette by editing the `app/theme-config.ts` file. This allows you to change the primary, secondary, and other colors.

## Library Usage

### Convert a webpage to Markdown

```typescript
const result = await markify({
  url: 'https://example.com'
});

console.log(result.markdown);
```

### Convert a raw HTML string to Markdown

```typescript
const result = await markify({
  htmlContent: '<h1>Hello World</h1>'
})

console.log(result.markdown)
```

### Ignore specific elements

```typescript
const result = await markify({
  url: 'https://example.com',
  ignoreSelectors: ['p', '.container']
});
```

<details>
    <summary>Examples of selectors to ignore</summary>

- Ignore all ```spans```

> ['span']

- Ignore all elements with the class ```container```

> ['.container']

Ignore all elements with a ```data-testid``` attribute equal to ```featured-item```

> ['[data-testid="featured-item"]']

Ignore all elements with id equals to 'banner'

> ['#banner']

</details>

### Run from the command line

```bash

# Clone the repository
git clone "https://github.com/thiagobarbosa/markify-ts.git"
cd markify

# Install dependencies
npm install

# Run with a specific URL
npm run markify -- --url "https://example.com"
# an output file will be created under "outputs/markdown.md"

# Run with a HTML string
npm run markify -- --html "<h1>Hello World</h1>"

# Run with a specific URL and ignore specific elements
npm run markify -- --url "https://www.booking.com/hotel/es/the-barcelona-edition.en-gb.html" --ignore "script,style"

# Define the output directory/file
npm run markify -- --url "https://example.com" --output "files/output.md"
```

## License

[MIT license](LICENSE)