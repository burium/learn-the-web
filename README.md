A documentation website built with Next.js, Fumadocs UI, and MDX to provide resources and tutorials for web development learning.

## Features

- 📚 Documentation with MDX
- 🔍 Full-text search functionality
- 🖼️ Dynamic OG image generation
- 📱 Responsive design
- 🎨 Clean and modern UI using Fumadocs
- ⚡ Fast and SEO-friendly with Next.js

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Fumadocs UI](https://fumadocs.vercel.app/) - Documentation UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Project Structure

```
learn-the-web/
├── app/
│   ├── (home)/               # Home page routes
│   ├── api/                  # API routes
│   │   ├── dynamic-og/       # Dynamic OG image generation
│   │   └── search/          # Search functionality
│   └── docs/                # Documentation pages
├── lib/                     # Shared utilities
├── content/                 # MDX documentation content
└── public/                 # Static assets
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/learn-the-web.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

You can start adding your documentation in the `content` directory using MDX format. The documentation is automatically organized based on the file structure.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
