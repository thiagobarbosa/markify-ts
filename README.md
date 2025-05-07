# Markify

Typescript library to seamlessly convert web pages
and HTML snippets into well-structured Markdown content.

## Features

- Convert web pages to Markdown from a URL
- Convert raw HTML strings to Markdown
- Ignore specific elements by providing a list of HTML selectors
- Command line interface

## Installation

```bash
npm install markify-ts
```

## Usage

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

### List of available parameters

- `url`: URL to be converted to Markdown
- `html`: HTML string to be converted to Markdown
- `ignoreSelectors`: Array of selectors to ignore
- `ignoreHiddenElements`: Boolean to ignore hidden elements, like those with `display: none` (default: `false`)
- `fetchOptions`: Fetch options to be used when fetching the URL (default: `{}`)

### Run from the command line

```bash

# Clone the repository
git clone "https://github.com/thiagobarbosa/markify-ts.git"
cd markify-ts/markify

# Install dependencies
npm install

# Run with a specific URL
npm run markify -- --url "https://example.com"
# an output file will be created under "outputs/markdown.md"

# Run with a HTML string
npm run markify -- --html "<h1>Hello World</h1>"

# Run with a specific URL and ignore specific elements
npm run markify -- --url "https://www.booking.com/hotel/es/the-barcelona-edition.en-gb.html" --ignore-selectors "script,style"

# Run with ignore hidden elements
npm run markify -- --url "https://www.booking.com/hotel/es/the-barcelona-edition.en-gb.html" --ignore-hidden

# Define the output directory/file
npm run markify -- --url "https://example.com" --output "files/output.md"
```

## License

[MIT license](LICENSE)