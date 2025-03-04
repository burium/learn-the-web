![Learn The Web](/public/og-image.png)

A comprehensive documentation website built with Next.js, Fumadocs UI, and MDX to provide structured resources and tutorials for learning web development from the ground up.

## Overview

Learn The Web is a modern documentation platform designed to help people understand web development concepts from foundational principles to advanced techniques. The content is organized in a logical progression:

1. **Foundational Concepts**: Core principles of how the web works including:
   - The Internet vs The Web
   - Client-Server Model
   - IP Addresses and DNS
   - URLs
   - HTTP and HTTPS
2. **Front-End Development**: User interface development covering:
   - HTML
   - CSS
   - JavaScript
3. **Back-End Development** (Coming Soon): Server-side logic
4. **Advanced Concepts** (Coming Soon): Production-level skills

## Features

- 📚 Comprehensive documentation with MDX support
- 🔍 Full-text search functionality
- 🖼️ Dynamic OG image generation for social sharing
- 📱 Fully responsive design for all devices
- 🎨 Clean and modern UI powered by Fumadocs
- ⚡ Fast and SEO-friendly with Next.js
- 📝 Easy-to-follow structured learning path
- 🤖 AI Assistant to help answer web development questions

## AI Assistant

The platform includes an interactive AI Assistant that:

- Answers questions about web development topics
- Provides explanations for HTML, CSS, JavaScript concepts
- Is accessible via a floating button or keyboard shortcut (Ctrl+/)
- Features a chat-like interface with markdown support
- Includes example prompts for new users
- Tracks token usage for transparency

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Fumadocs UI](https://fumadocs.vercel.app/) - Documentation UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [AI SDK](https://ai.vercel.ai/) - AI functionality

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
│   └── assistant-dialog.tsx # AI Assistant component
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

If you find this project helpful, please consider:
- Giving it a ⭐️ on GitHub
- [Becoming a sponsor](https://github.com/sponsors/R4ULtv/)
