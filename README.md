Download an npm package once and reuse it in any future projects without installing again.
Also handles the package.json conflict from foreign project

### Installation

You need to install the package globally to use over directories.

```sh
$ npm install -g linknpm
```

### Use (Foreign Project)

Navigate to a foreign project directory where node_modules is to be installed

```sh
$ cd foreign_app
$ link  # links every dependencies present in package.json file
```

### Use (New Project)

Navigate to a new project directory to link the globally installed packages

```sh
$ cd newapp
$ link express  # downloads latest "express" module globally, links and updates package.json file
```
