import React from 'react';
import './App.css';
import Header from "./Header";
import Photos from "./Photos";
import './global.css';

function App() {
  return (
    <div className="App">
        <Header className="Header" />
        <div className="Users">[users]</div>
        <main>
            <Photos/>
        </main>
        <div className="bottom">
            <div className="box">[notes]</div>
            <div className="box">[map]</div>
            <div className="box">[player]</div>
        </div>
    </div>
  );
}

export default App;
