import "./App.css";
import { useState, useEffect } from "react";

function App() {
  type Todo = {
    _id: string;
    name: string;
    completed: boolean;
  };
  
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [fetchSignal, setFetchSignal] = useState(true);

  useEffect(() => {
    const fetchAllTasks = async () => {
      const response = await fetch("/task/");
      const fetchedTasks = await response.json();
      setTasks(fetchedTasks);
    };
    fetchAllTasks();
  }, [fetchSignal]);

  const handleAddTodo = async () => {
    if (name) {
      const data = { name: name };

      await fetch("/task/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setFetchSignal(!fetchSignal);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleUpdateTodo = async (id: string, data: object) => {
    await fetch(`/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFetchSignal(!fetchSignal);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const handleDeleteTodo = async (id: string) => {
    await fetch(`task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFetchSignal(!fetchSignal);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const submitHandle = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
      setName("");
    }
  };

  return (
    <div className="m-auto w-full md:w-[500px]">
      <h1 className="mb-5 text-3xl">Tarefas</h1>
      <div className="flex items-center border-b-2 border-t-2">
        <span className="flex h-4 w-4 items-center justify-center text-gray-400">
          +
        </span>
        <input
          type="text"
          placeholder="Adicionar tarefa"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => submitHandle(e)}
          value={name}
          className="flex-1 p-1 focus:outline-none"
        />
      </div>

      <h2 className="mt-5 text-2xl">Pendentes</h2>
      {tasks.filter(task => !task.completed).map((task) => (
        <div key={task._id} className="flex items-center border-b-2">
          <input
            type="checkbox"
            onChange={() =>
              handleUpdateTodo(task._id, { completed: !task.completed })
            }
            checked={task.completed}
            className="h-4 w-4"
          />
          <h3 className={`flex-1 p-1${task.completed ? " line-through" : ""}`}>
            {task.name}
          </h3>
          <button
            onClick={() => handleDeleteTodo(task._id)}
            className="flex h-4 w-4 items-center justify-center hover:rounded-full hover:bg-slate-300"
            title="Delete"
          >
            &times;
          </button>
        </div>
      ))}

      <h2 className="mt-5 text-2xl">Completas</h2>
      {tasks.filter(task => task.completed).map((task) => (
        <div key={task._id} className="flex items-center border-b-2">
          <input
            type="checkbox"
            onChange={() =>
              handleUpdateTodo(task._id, { completed: !task.completed })
            }
            checked={task.completed}
            className="h-4 w-4"
          />
          <h3 className={`flex-1 p-1${task.completed ? " line-through" : ""}`}>
            {task.name}
          </h3>
          <button
            onClick={() => handleDeleteTodo(task._id)}
            className="flex h-4 w-4 items-center justify-center hover:rounded-full hover:bg-slate-300"
            title="Delete"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
