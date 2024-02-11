import React, { useContext } from 'react';
import { CalendarContext } from '../context/CalendarContext';

function Task({ task, style }) {
    const { setTask } = useContext(CalendarContext);

    const handleTaskClick = () => {
        setTask(task);
    };

    return (
        <p style={style} onClick={handleTaskClick}>
            {task.name.length > 5 ? task.name.substring(0, 5) + "..." : task.name}
        </p>
    );
}

export default Task;
