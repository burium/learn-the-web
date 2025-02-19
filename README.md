![Learn The Web](/public/og-image.png)

A comprehensive documentation website built with Next.js, Fumadocs UI, and MDX to provide structured resources and tutorials for learning web development from the ground up.

## Overview

Learn The Web is a modern documentation platform designed to help people understand web development concepts from foundational principles to advanced techniques.
The content is organized in a logical progression, making it ideal for both beginners and experienced developers looking to fill knowledge gaps.

## Features

- 📚 Comprehensive documentation with MDX support
- 🔍 Full-text search functionality
- 🖼️ Dynamic OG image generation for social sharing
- 📱 Fully responsive design for all devices
- 🎨 Clean and modern UI powered by Fumadocs
- ⚡ Fast and SEO-friendly with Next.js
- 📝 Easy-to-follow structured learning path

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Fumadocs UI](https://fumadocs.vercel.app/) - Documentation UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Project Structure

```
learn-the-web/
├── app/                      # Next.js app directory
│   ├── (home)/              # Home page routes
│   ├── api/                 # API routes
│   │   ├── dynamic-og/      # OG image generation
│   │   └── search/         # Search functionality
│   └── docs/               # Documentation pages
├── components/             # React components
├── content/               # MDX documentation content
│   └── docs/             # Organized content sections
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/r4ultv/learn-the-web.git
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

You can start adding your documentation in the `content` directory using MDX format.
The documentation is automatically organized based on the file structure.

## Contributing

Contributions are welcome! Whether it's:

- 📝 Adding new content
- 🐛 Fixing bugs
- 🌟 Improving features
- 📚 Enhancing documentation

Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Support

If you find this project helpful, please consider giving it a ⭐️ on GitHub!
