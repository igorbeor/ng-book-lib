# NgBookLib

A small Angular application for importing a book library from an XML file, mapping
how that XML should be parsed, reviewing and editing the books in a table, and
exporting the result back to XML.

The workflow is a guided stepper:

1. **Configure & upload** — describe the XML shape (list element, item element, and
   how each book field maps to an element or attribute) and upload the file.
2. **Review & edit** — parsed books are shown in a table where they can be edited or
   removed.
3. **Export** — download the current book list as a new XML file.

Sample XML files covering the supported shapes (attribute-based, element-based, and
grouped) live in [`sample-books/`](./sample-books).

Built with Angular 22, Angular Material, and RxJS. Generated with
[Angular CLI](https://github.com/angular/angular-cli) 22.0.1.

## Project structure

```
ng-book-lib/
├── public/             # Static assets served as-is
├── sample-books/       # Example XML files for trying out the parser
└── src/
    └── app/
        ├── components/ # UI: file-upload, xml-parser-form, books-table, set-book-dialog
        ├── models/     # TypeScript interfaces (Book, ParserConfig)
        └── services/   # XML parsing (document-parser) and in-memory store (book-store)
```

## Running locally

Requirements: Node.js and npm (this repo pins `npm@11.13.0` via `packageManager`).

```bash
npm install   # install dependencies
npm start     # start the dev server
```

Then open `http://localhost:4200/`. The app reloads automatically as you edit source files.

## Main commands

| Command         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `npm start`     | Run the development server at `http://localhost:4200/`.  |
| `npm run build` | Build the project into `dist/`.                          |
| `npm run watch` | Build in watch mode using the development configuration. |
| `npm test`      | Run unit tests with the [Vitest](https://vitest.dev/) runner. |
| `npm run ng`    | Run the Angular CLI directly (e.g. `npm run ng generate component name`). |

## Additional resources

For more on the Angular CLI and its commands, see the
[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
