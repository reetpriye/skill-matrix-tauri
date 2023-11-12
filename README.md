# Skill Matrix Project README

Welcome to the Skill Matrix project built using React and Tauri. This project combines the power of React for building user interfaces with Tauri to create native desktop applications. Below are instructions on how to use and develop for this project.

## Prerequisites

Before you begin, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Rust](https://www.rust-lang.org/) (Tauri requires Rust for building the native components)
- [Tauri CLI](https://tauri.studio/docs/getting-started/intro) (Install with `npm install -g tauri`)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/reetpriye/skill-matrix-tauri.git
   ```

2. Navigate to the project directory:

   ```bash
    cd skill-matrix-tauri
   ```

3. Install the project dependencies using Yarn:

   ```bash
   yarn install
   ```

## Available Scripts

In the project directory, you can run the following scripts:

`1. yarn run tauri build`

Builds the Tauri application into an executable for your platform (e.g., .exe, .app, or .dmg).

```bash
    yarn run tauri build
```

This command will generate the executable in the ./target/release/ directory.

`2. yarn run dev`

```bash
    yarn run dev
```

Runs the app in development mode. This command starts the Tauri application in development mode, and the React app in a development server. Any changes you make to the React code will automatically be reflected in the Tauri application.

`3. yarn run start`

Runs the app in development mode. This command starts the React app in a development server. Any changes you make to the React code will automatically be reflected in the react application.

```bash
    yarn run start
```

Starts the React development server on localhost:3000. This command is useful for standalone React development if you don't need the Tauri components.

## Development Workflow

1. Use `yarn run dev` to run the Tauri development server and work on your UI.

2. As you make changes to your React code, the Tauri application should automatically reflect those changes.

3. When you're ready to distribute your application, use `yarn run tauri build` to create an executable for your platform.

## Configuration

You can find Tauri and React configurations in the tauri.conf.js and src directory, respectively. Customize these configurations to suit your project's needs.

## Learn More

For more information on Tauri, visit the [Tauri documentation](https://tauri.studio/docs/).

For more information on React, visit the [React documentation](https://reactjs.org/).

Happy coding!
