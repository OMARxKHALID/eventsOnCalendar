import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { CalendarContext } from "../context/CalendarContext";
import { CirclePicker } from "react-color";
import { MdCancel, MdDelete, MdSave } from 'react-icons/md';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function TaskForm() {
  const { date, task, setTask, saveTask, setDate, deleteTask } = useContext(CalendarContext);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#f44336");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name || "");
      setColor(task.color || "#f44336");
    }
  }, [task]);

  const closeModal = () => {
    setTask(null);
    setError(false);
  };

  const saveTaskHandler = () => {
    if (name.trim().length < 1) {
      setError(true);
      return;
    }
    setError(false);

    saveTask({
      ...task,
      date: date,
      name: name,
      color: color,
    });
    setDate(date);
    closeModal();
  };

  const deleteTaskHandler = () => {
    deleteTask(task.id);
    setDate(date);
    closeModal();
    setError(false);
  }

  return (
    <Modal
      isOpen={task != null}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Task Form"
    >
      <div className="task-form">
        <label>Name</label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Task Name"
        />
        <label>Color</label>
        <div>
          <CirclePicker
            color={color}
            onChange={(color) => {
              setColor(color.hex);
            }}
          />
        </div>
        <div>
          <button className="button button-red" onClick={closeModal}>
            <div className="button-content">
              <MdCancel size={20} /> <span>Cancel</span>
            </div>
          </button>
          {task && task.id ? (
            <button className="button button-orange" onClick={deleteTaskHandler}>
              <div className="button-content">
                <MdDelete size={20} /> <span>Delete</span>
              </div>
            </button>
          ) : null}
          <button className="button button-green" onClick={saveTaskHandler}>
            <div className="button-content">
              <MdSave size={20} /> <span>Save</span>
            </div>
          </button>
        </div>
        {error && <p className="error">The name of the task is required</p>}
      </div>
    </Modal>
  );
}

export default TaskForm;
