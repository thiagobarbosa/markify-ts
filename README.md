# Markify

Typescript library to seamlessly convert web pages
and HTML snippets into well-structured Markdown content.

## Installation

```bash
npm install markify
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

### Run from the command line 

```bash

# Clone the repository
git clone "https://github.com/thiagobarbosa/markify-ts.git"
cd markify

# Install dependencies
npm install

# Run with a specific URL
npm run markify "https://example.com"
# an output file will be created under "outputs/markdown.md"

# Define the output directory/file
npm run markify "https://example.com" "files/output.md"
```

## License

[MIT license](LICENSE)