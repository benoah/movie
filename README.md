# 🎥 My Movie - React Movie Recommendation App

Welcome to **My Movie**, a React-based movie recommendation app. This project is designed to showcase your skills as a developer, featuring a clean UI and smooth user interactions, with data fetched from a movie API. It is intended as a portfolio piece to demonstrate your frontend development capabilities.

## 🚀 Live Demo

Check out the live demo [here](https://cosmic-buttercream-90cc24.netlify.app/).

## 📦 Features

- **Responsive Design**: Built using Tailwind CSS for a seamless experience across devices.
- **Movie & TV Show Recommendations**: Displays personalized recommendations based on your preferences.
- **Interactive UI with Animations**: Smooth animations using Framer Motion.
- **Custom Hooks**: Utilizes React hooks for fetching and managing movie data.
- **Movie Modal**: View detailed information and trailers in a modal overlay.
- **Dark Mode**: Eye-friendly dark theme with glassmorphism effects.

## 🛠️ Tech Stack

- **React** with TypeScript: Core framework for building the app.
- **Tailwind CSS**: For styling and responsive design.
- **Framer Motion**: For animations and smooth transitions.
- **React Icons**: For using SVG icons like Chevron buttons.
- **TMDb API**: For fetching movie and TV show data.
- **Custom React Hooks**: To manage data fetching and state.

## 📂 Project Structure

Here's an overview of the main project structure:

```
src/
├── component/
│   ├── movie/
│   │   └── RecommendedForYou.tsx
│   ├── navigation/
│   │   ├── Nav.tsx
│   │   └── Footer.tsx
│   └── shared/
│       └── MovieModal.tsx
├── hooks/
│   ├── useMovieList.ts
│   └── useRecommendations.ts
├── pages/
│   └── Home.tsx
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

### Key Files

- `App.tsx`: Main application component that wraps the navigation, home content, and footer.
- `RecommendedForYou.tsx`: The main component showcasing movie and TV show recommendations with smooth animations and a filter button.
- `useRecommendations.ts`: Custom hook for fetching recommendations from the API.
- `useMovieList.ts`: Custom hook for managing movie list actions like scrolling, liking, and opening the modal.

## 🛠️ Installation

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/benoah/movie.git
   ```

2. Navigate to the project directory:

   ```bash
   cd movie
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and add your TMDb API key:

   ```bash
   REACT_APP_API_KEY=your_tmdb_api_key
   ```

5. Start the development server:

   ```bash
   npm start
   ```

6. Open the app in your browser:

   ```
   http://localhost:3000
   ```

## 🧩 Custom Hooks

The project leverages custom hooks to keep the code modular and reusable:

- **`useRecommendations.ts`**: Fetches movie/TV recommendations based on the selected type (movie or TV).
- **`useMovieList.ts`**: Manages the state of the movie list, handles scrolling, toggling likes, and opening/closing the modal.

## 🎨 Styling

The UI is styled using **Tailwind CSS**, which makes it easy to apply utility-first classes for responsive design. The project also includes custom styles for glassmorphism effects and animations.

## ⚙️ Animations

The app uses **Framer Motion** for animations:

- Smooth fade-in and slide animations for content loading.
- Button hover effects with scale transformations.
- Animated dividers and pulse effects for an engaging UI.

## 📋 API Reference

This project uses the **TMDb API** to fetch movie and TV data.

- Base URL: `https://api.themoviedb.org/3`
- Example endpoint to get recommendations:

  ```bash
  GET /movie/{movie_id}/recommendations?api_key=your_api_key
  ```

## 💻 Deployment

You can deploy this app using any static site hosting service like **Vercel**, **Netlify**, or **GitHub Pages**.

For example, to deploy on Vercel:

```bash
vercel deploy
```

## 🐛 Known Issues

- Some images may fail to load if they are unavailable from the TMDb API. The app uses a fallback image in such cases.

## 📈 Future Enhancements

- **Search Functionality**: Add a search bar for users to find specific movies or TV shows.
- **User Authentication**: Allow users to create accounts and save their liked movies.
- **Genre Filtering**: Enable filtering of recommendations based on selected genres.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Contact

For any questions or feedback, please reach out at [your-email@example.com](mailto:your-email@example.com).

---

Let me know if you need any more details or want to make changes!

# My Movie

Dette prosjektet er laget som en del av en læringsreise for å utvikle og forbedre ferdigheter som utvikler, med spesielt fokus på frontend-utvikling ved bruk av React og tilhørende verktøy.

## Om prosjektet

My Movie er en webapplikasjon utviklet med **React** og **TypeScript** for å gi en sømløs opplevelse for film- og seriefans. Med et moderne brukergrensesnitt og flere nyttige funksjoner, kan brukere søke etter filmer og serier, få anbefalinger, og holde seg oppdatert på kommende utgivelser og trender.

## Teknologi og avhengigheter

Dette prosjektet bruker flere avhengigheter og verktøy for å levere en moderne og responsiv opplevelse:

- **React** og **TypeScript** for komponentbasert utvikling.
- **Framer Motion** for animasjoner og brukervennlige effekter.
- **React Router** for navigasjon.
- **Lodash** og **Fuse.js** for effektiv databehandling og søkefunksjonalitet.
- **Tailwind CSS** for rask og konsistent styling.
- **Styled Components** for fleksibel, komponent-basert styling.

## Tilgjengelige kommandoer

For å komme i gang med prosjektet, kan du bruke følgende kommandoer:

### `npm start`

Starter applikasjonen i utviklingsmodus.\
Åpne [http://localhost:3000](http://localhost:3000) i nettleseren din for å se applikasjonen.

### `npm test`

Kjører testene i interaktivt modus.\
Se [testing-dokumentasjonen](https://facebook.github.io/create-react-app/docs/running-tests) for mer informasjon.

### `npm run build`

Bygger applikasjonen for produksjon i `build`-mappen.\
Optimaliserer React-koden for best mulig ytelse.

### `npm run eject`

**Merk:** `eject` er en enveiskommando. Når du har kjørt denne, kan du ikke gå tilbake! Denne kommandoen vil fjerne den forhåndskonfigurerte oppsettet fra prosjektet ditt og gi deg full kontroll over alle konfigurasjonsfiler.

## Lær mer

Dette prosjektet ble startet med [Create React App](https://github.com/facebook/create-react-app). Utforsk gjerne den [offisielle dokumentasjonen](https://facebook.github.io/create-react-app/docs/getting-started) for flere detaljer.

For å lære mer om React, se [React-dokumentasjonen](https://reactjs.org/).

---

Dette prosjektet handler om å vokse som utvikler ved å jobbe praktisk med teknologier som React og TypeScript. Gjennom denne applikasjonen får du erfaring med å bygge moderne brukergrensesnitt, integrere tredjepartsbiblioteker, og optimere koden for en produksjonsklar applikasjon.
