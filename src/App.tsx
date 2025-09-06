import Box from "./components/box";
import "./styles/main.scss";


function App() {
  return (
    <div className="app-container">
     
      <div className="content-wrapper">
        <h1 className="main-title">
          🎉 We have a little secret… It's your birthday today! 🎉
        </h1>
        <h2 className="subtitle-title">
          Are you ready to open the magic box? ✨
        </h2>
        <p className="subtitle">
          Click on the gift below to reveal special messages and surprises 💌
        </p>
        <Box />
      </div>
    </div>
  );
}

export default App;
