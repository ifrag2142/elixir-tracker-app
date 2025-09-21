# Elixir Inventory Tracker

## Table of Contents
*   [Project Title](#elixir-inventory-tracker)
*   [Description](#description)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Setup & Installation](#setup--installation)
*   [Running the Application](#running-the-application)
*   [Usage](#usage)
*   [Deployment](#deployment)
*   [Folder Structure](#folder-structure)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)
---

## Description
The Elixir Inventory Tracker is a comprehensive React-based web application designed to help users manage their in-game elixir inventories. It allows for detailed tracking of various elixir types and tiers, calculates total reference points, and features an advanced optimal selection tool to meet specific reference point targets. Additionally, it includes a versatile elixir point calculator for various conversions. All inventory data is persistently stored in the browser's local storage, ensuring that your progress is saved even after refreshing the page.
---

## Features
*   **Detailed Elixir Inventory Management:**
    *   Track elixirs across multiple types: `CD`, `ATK`, `TD`, `SD`, `HP`.
    *   Manage quantities for different tiers: `Common`, `Good`, `Sturdy`, `Rare`, `Perfect`, `Scarce`, `Epic`, `Legendary`, `Immortal`, `Myth`, `Eternal`.
    *   Each elixir tier is color-coded for easy visual identification.
    *   Clear all inputs for a specific elixir type with a dedicated button.
*   **Reference Point Calculation:**
    *   Automatically calculates total reference points for each elixir type.
    *   Displays the overall total reference points across all elixir types.
*   **Optimal Elixir Selection:**
    *   Input a target reference point value.
    *   Select specific elixir types to include in the calculation.
    *   The algorithm prioritizes using lower-tiered elixirs first to meet the target efficiently.
    *   Provides the closest achievable reference point value that is equal to or higher than the target if an exact match isn't possible.
*   **Elixir Point Calculator:**
    *   Input any elixir point total and a coefficient.
    *   Perform multiplication or division operations to get the resulting value.
    *   Includes input validation and error handling (e.g., division by zero).
*   **Data Persistence:**
    *   All inventory data is automatically saved to the browser's `localStorage`, ensuring data is retained even after page refreshes.
*   **User-Friendly Interface:**
    *   Built with React and styled using Tailwind CSS for a modern, responsive, and intuitive user experience.
    *   Improved scrollability for elixir type input sections.
    ---

## Technologies Used
*   [React](https://react.dev/): A JavaScript library for building user interfaces.
*   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
*   [Lucide React](https://lucide.dev/): A collection of beautiful open-source icons.
*   JavaScript (ES6+)
*   HTML5
*   CSS3
---

## Setup & Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites
*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/docs/install)

### Installation Steps

1.  **Clone the repository** (or create a new React project and copy the code):
    ```bash
    git clone https://github.com/YOUR_USERNAME/elixir-inventory-tracker.git
    cd elixir-inventory-tracker
    ```
    *If you received the code as a craft, you'll need to create a new React project first:*
    ```bash
    npx create-react-app elixir-tracker-app # or npm create vite@latest elixir-tracker-app -- --template react
    cd elixir-tracker-app
    # Then copy the provided App.jsx content into src/App.jsx of this new project.
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install Lucide React (for icons):**
    ```bash
    npm install lucide-react
    # or
    yarn add lucide-react
    ```

4.  **Configure Tailwind CSS:**
    *   Install Tailwind CSS, PostCSS, and Autoprefixer:
        ```bash
        npm install -D tailwindcss postcss autoprefixer
        # or
        yarn add -D tailwindcss postcss autoprefixer
        ```
    *   Generate your `tailwind.config.js` and `postcss.config.js` files:
        ```bash
        npx tailwindcss init -p
        ```
    *   Configure your `tailwind.config.js` file to scan for Tailwind classes in your project files. Open `tailwind.config.js` and update the `content` array:
        ```javascript
        // tailwind.config.js
        module.exports = {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {},
          },
          plugins: [],
        }
        ```
    *   Add the Tailwind CSS directives to your `src/index.css` file (create it if it doesn't exist):
        ```css
        /* src/index.css */
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```
---

## Running the Application

To run the application in development mode:

```bash
npm start
# or
yarn start
# For Vite: npm run dev or yarn dev
```
This will open the application in your browser, usually at http://localhost:3000. The page will reload if you make edits.

## Usage

### Elixir Inventory
*   Navigate to the left column titled "Your Elixir Inventories".
*   Each elixir type (`CD`, `ATK`, `TD`, `SD`, `HP`) has its own collapsible section.
*   Expand a section to see tiers (`Common` to `Eternal`).
*   Input the quantity of each elixir tier you possess in the respective input fields.
*   Your inputs are automatically saved to your browser's local storage.
*   Click the "Clear" button next to an elixir type name to reset all quantities for that specific type to zero.

### Elixir Tier Reference Points
The application uses the following reference point values for each elixir tier:

| Tier        | Ref Points | Color Code   |
| :---------- | :--------- | :----------- |
| Common      | 1          | Grey         |
| Good        | 2          | Light Green  |
| Sturdy      | 3          | Light Blue   |
| Rare        | 4          | Green        |
| Perfect     | 5          | Dark Blue    |
| Scarce      | 6          | Light Pink   |
| Epic        | 8          | Light Orange |
| Legendary   | 10         | Purple       |
| Immortal    | 14         | Pink         |
| Myth        | 20         | Dark Orange  |
| Eternal     | 28         | Brilliant Yellow |

### Optimal Elixir Selection
*   In the right column, find the "Optimal Elixir Selection" section.
*   **Target Reference Points:** Enter the total reference points you aim to achieve.
*   **Include Elixir Types:** Use the checkboxes to select which elixir types (`CD`, `ATK`, etc.) should be considered in the calculation.
*   Click "Calculate Optimal Usage".
*   The application will display a breakdown of the lowest-tiered elixirs from your selected types needed to reach your target.
*   If an exact match isn't possible, it will show the closest value that is higher than your target.

### Elixir Point Calculator
*   Below the optimal selection tool, locate the "Elixir Point Calculator" section.
*   **Current Elixir Points:** Enter an initial numerical value.
*   **Coefficient:** Enter a coefficient for the operation.
*   **Operation:** Select either "Multiply" or "Divide."
*   The result will be calculated and displayed dynamically. Error messages will appear for invalid inputs (e.g., division by zero).
---

## Deployment

This is a static site (SPA) and can be easily deployed to various hosting providers.

1.  **Build the application:**
    ```bash
    npm run build
    # or
    yarn build
    ```
    This command creates an optimized `build` folder containing all the static assets.

2.  **Choose a hosting provider:**
    *   **Netlify:** Highly recommended for its continuous deployment from Git, custom domains, and free SSL. Simply connect your GitHub repository and specify `build` as the publish directory and `npm run build` as the build command.
    *   **Vercel:** Another excellent choice with similar features to Netlify. Connect your Git repository, and Vercel will automatically detect the React project and configure the build settings.
    *   **GitHub Pages:** Suitable if your project is already hosted on GitHub. You might need to use the `gh-pages` npm package to deploy your `build` folder to a `gh-pages` branch.

    *Refer to the specific documentation of your chosen hosting provider for detailed deployment instructions.*
    ---

## Folder Structure
elixir-inventory-tracker/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx             # Main application component
│   ├── index.css           # Tailwind CSS directives
│   ├── index.js            # React app entry point
│   ├── components/
│   │   ├── ElixirInputItem.jsx
│   │   ├── ElixirInventory.jsx
│   │   ├── ElixirTypeInventory.jsx
│   │   ├── ElixirPointCalculator.jsx
│   │   ├── OptimalSelectionCalculator.jsx
│   │   └── TotalSummaryDisplay.jsx
│   └── App.test.js         # (If using Create React App)
├── .gitignore              # Specifies intentionally untracked files to ignore
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # Project README file
---

## Contributing
Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.
---

## License
This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

## Contact
For any questions or feedback, please open an issue in the repository or reach out.