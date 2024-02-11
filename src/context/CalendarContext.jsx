import React, { createContext, useReducer } from "react";
import { v4 as uuidv4 } from 'uuid';

const SET_DATE = "SET_DATE";
const SET_TASK = "SET_TASK";
const SAVE_TASK = "SAVE_TASK";
const DELETE_TASK = "DELETE_TASK";

const getDatabase = () => {
  let db = localStorage.getItem("$calendar_db");
  if (!db) {
    db = [];
    setDatabase(db);
  } else {
    db = JSON.parse(db).map(task => ({ ...task, date: new Date(task.date) }));
  }
  return db;
}

const setDatabase = (db) => {
  localStorage.setItem("$calendar_db", JSON.stringify(db));
}

export const CalendarContext = createContext();

export const sameDay = (a, b) => {
  return a.getDate() === b.getDate()
    && a.getMonth() === b.getMonth()
    && a.getFullYear() === b.getFullYear();
}

function calendarReducer(state, action) {
  switch (action.type) {
    case SET_DATE:
      const date = action.payload;
      const d1 = new Date(date.getFullYear(), date.getMonth(), 1);
      d1.setDate(d1.getDate() - (d1.getDay() === 0 ? 7 : d1.getDay()));
      const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      if (d2.getDay() !== 0) d2.setDate(d2.getDate() + (7 - d2.getDay()));

      const db = getDatabase();
      const days = [];
      do {
        d1.setDate(d1.getDate() + 1);
        days.push({
          date: new Date(d1.getTime()),
          tasks: db.filter((task) => sameDay(d1, task.date))
        });
      } while (!sameDay(d1, d2));

      return { ...state, date, days };

    case SET_TASK:
      return { ...state, task: action.payload };

    case SAVE_TASK:
      const newTask = action.payload;
      let updatedDb = getDatabase();
      if (!newTask.id) {
        newTask.id = uuidv4();
        updatedDb.push(newTask);
      } else {
        updatedDb = updatedDb.map(t => (t.id === newTask.id ? newTask : t));
      }
      setDatabase(updatedDb);
      return { ...state };

    case DELETE_TASK:
      const taskId = action.payload;
      let filteredDb = getDatabase().filter((task) => task.id !== taskId);
      setDatabase(filteredDb);
      return { ...state };

    default:
      return state;
  }
}

function CalendarState(props) {
  const initialState = {
    date: new Date(),
    days: [],
    task: null
  };

  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const setDate = (date) => dispatch({ type: SET_DATE, payload: date });
  const setTask = (task) => dispatch({ type: SET_TASK, payload: task });
  const saveTask = (task) => dispatch({ type: SAVE_TASK, payload: task });
  const deleteTask = (taskId) => dispatch({ type: DELETE_TASK, payload: taskId });

  return (
    <CalendarContext.Provider
      value={{
        date: state.date,
        days: state.days,
        task: state.task,
        setDate,
        setTask,
        saveTask,
        deleteTask
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
}

export default CalendarState;
