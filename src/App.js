import React from 'react';
import './App.css';
import Header from "./Header";
import Photos from "./Photos";
import './global.css';

function App() {
  return (
    <div className="App">
        <Header className="Header" />
        <main>
            <div className="top">
                <Photos/>
            </div>
            <div className="bottom">
                <div className="box">[notes]</div>
                <div className="box">[map]</div>
                <div className="box">[player]</div>
            </div>
        </main>
        <footer>
            [footer]
        </footer>
    </div>
  );
}

export default App;
