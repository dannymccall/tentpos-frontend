# TentHub TentPOS

React + TypeScript + Vite frontend for TentHub TentPOS.

This project uses Vite for fast development with Hot Module Replacement (HMR) and ESLint for code quality.

## Features

- React + TypeScript support
- Fast Refresh with Vite
- Type-aware ESLint configuration
- Optional React-specific lint rules via `eslint-plugin-react-x` and `eslint-plugin-react-dom`

## Getting Started

### Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])

```



---

This project is licensed under the MIT License. See LICENSE
 for details.
💡 **Notes:**  
- I’ve added sections like **Getting Started**, **Build & Lint Commands**, and a clear **Folder Structure**.  
- I kept your ESLint info but formatted it for readability.  
- Added a **License section** to remind collaborators about MIT.  

If you want, I can also make a **ready-to-push version of the entire frontend repo** with:  

- This README  
- `.gitignore` (Vite + React optimized)  
- Starter `src/` folder with example components  
- `package.json` with scripts  

It’ll be **fully GitHub-ready** so you can start coding immediately.  

