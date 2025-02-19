# KNEC Results Scraper

A Deno-based script that fetches and parses examination results from the [KNEC results website](https://results.knec.ac.ke/). The script sends POST requests with necessary headers and parameters, processes the returned HTML, converts the results table to JSON, and writes the compiled data to a file.

> **Disclaimer:**```  This project is not affiliated with, endorsed by, or supported by the Kenya National Examinations Council (KNEC). It is provided for educational and informational purposes only.```

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features 

- **Automated Web Scraping:** Fetches result pages for a list of learners.
- **HTML Parsing:** Uses `node-html-parser` to extract relevant data from the HTML.
- **Table to JSON Conversion:** Leverages `tabletojson` to convert HTML tables into JSON objects.
- **Error Handling & Retries:** Implements retries on failed network requests.
- **Deno Powered:** Utilizes Deno for secure, modern, and efficient TypeScript execution.
- **JSON Output:** Aggregates all fetched results into a `results.json` file.

## Prerequisites

- [Deno](https://deno.land/) installed (version 1.0 or higher).
- An active internet connection to access the KNEC results website.

## Installation

Clone this repository:

```bash
git clone https://github.com/yourusername/knec-results-scraper.git
cd knec-results-scraper
```

The script uses external modules (`node-html-parser` and `tabletojson`) which are imported directly via URLs or from your local environment. Deno handles these dependencies without additional configuration.

## Usage

1. **Configure Learner Indexes**

   Create or update the `indexes.ts` file with an array of learner objects. For example:

   ```typescript
   export const indexes = [
     { INDEXNO: "123456", NAME: "John Doe" },
     // Add more learner objects as needed...
   ];
   ```

2. **Run the Script**

   Execute the script with network permissions:

   ```bash
   deno run --allow-net fetch_page.ts
   ```

   The script will iterate over each learner, fetch their exam results, parse the HTML to extract relevant details (such as subject grades, school, mean grade, etc.), and then write the compiled data into a `results.json` file.

## Project Structure

```
knec-results-scraper/
├── fetch_page.ts      # Main script to fetch and process KNEC results
├── indexes.ts         # Module containing learner index data
├── results.json       # Output file (generated after running the script)
└── README.md          # Project documentation
```

## Contributing

Contributions, bug reports, and feature requests are welcome! Please feel free to open an issue or submit a pull request if you have improvements or fixes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [node-html-parser](https://github.com/taoqf/node-html-parser)
- [tabletojson](https://github.com/mattsheft/tabletojson)
- The developers of [Deno](https://deno.land/)
- [KNEC](https://results.knec.ac.ke/) for providing the data source

Happy scraping!
```
