// App.js
import React from 'react';
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import CalendarState from "./context/CalendarContext"; 
import TaskForm from "./components/TaskForm";
import { MdLaptopWindows } from 'react-icons/md'; 

function App() {
  const isMobile = window.innerWidth <= 768; 

  return (
    <div className="container">
      <CalendarState>
        {isMobile ? (
          <div className="mobile-message">
            <MdLaptopWindows size={100} color="#f44336" />
            <p>This app is only available on full-screen</p>
          </div>
        ) : (
          <>
            <Header />
            <Calendar />
            <TaskForm />
          </>
        )}
      </CalendarState>
    </div>
  );
}

export default App;
