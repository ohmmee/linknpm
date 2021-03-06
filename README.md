Download an npm package once and reuse it in any future projects without installing again.

Also handles the package.json conflict from foreign project

### Installation

You need to install the package globally to use over directories.

```sh
$ npm install -g linknpm
```

### Use (Foreign Project)

Navigate to a foreign project directory where package.json is present and node_modules is to be installed

```sh
$ cd foreign_app
$ link    # links every dependencies present in package.json file
```

### Use (New Project)

Navigate to a new project directory to link the globally installed packages

> only one package allowed at once for now

```sh
$ cd newapp
$ link express    # downloads latest "express" module globally, links and updates package.json file
```

<!-- ### Scenarios

| Scenario | linknpm does |
| -------- | ------------ |
| package.json is present |  -->

On Conflict between installed version and package.json requirement, it'll prompt for input

- "u" to update the global package and npm link => npm i -g <package-name> && npm link <package-name>
- "l" to force link the older version that's already installed, gives warning
