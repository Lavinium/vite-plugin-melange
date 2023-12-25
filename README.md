# Melange Vite Plugin

A simple vite plugin for building and hot reloading Reason files

## About
This plugin is for developers who compile Reason using `dune build`. When running `npm run dev` vite will spawn a dune process and when dune rerenders changed files, vite will reflect those changes in the browser.

## Usage

Add the melangePlugin to vite config and 
```js
// vite.config.js
import melangePlugin from '@lavinium/vite-plugin-melange';

export default defineConfig({
    return {
        plugins: [
            melangePlugin({
                src: 'src',
                target: 'output',
            })
        ],
    };
});
```

Import the Reason file you wish to use in your main application file. 

```js
// app.js
import 'app/main.re'
```

example dune file

```lisp
;; src/dune

(melange.emit
    (target output)
    ;; ...
)
```
