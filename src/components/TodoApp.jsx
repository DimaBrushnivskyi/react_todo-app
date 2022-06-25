import React, { useEffect, useMemo, useState } from 'react';
import { TodoList } from './TodoList';
import { TodosFilter } from './TodosFilter';

export const TodoApp = React.memo(() => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState(true);
  const [filter, setFilter] = useState('All');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Completed':
        return todos.filter(todo => todo.completed);

      case 'Active':
        return todos.filter(todo => !todo.completed);

      default:
        return todos;
    }
  }, [filter, todos]);

  const onClickHandler = (e) => {
    setInput(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!input) {
      return;
    }

    const id = +new Date();
    const todo = {
      id,
      title: input,
      completed: false,
    };

    setTodos(state => [...state, todo]);
    setInput('');
  };

  const allCompletedHandler = () => {
    // setAllTodos(!allTodos);
    setAllTodos(prev => !prev);
    setTodos(todos.map((todo) => {
      if (allTodos) {
        return {
          ...todo,
          completed: true,
        };
      }

      return {
        ...todo,
        completed: false,
      };
    }));
  };

  const filterHandler = () => filteredTodos;

  const removeCompletedTodosHandler = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const setToLocalStrg = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const getLocalTodos = () => {
    if (localStorage.getItem('todos') === null) {
      localStorage.setItem('todos', JSON.stringify([]));
    } else {
      setTodos(JSON.parse(localStorage.getItem('todos')));
    }
  };

  useEffect(() => {
    getLocalTodos();
  }, []);

  useEffect(() => {
    filterHandler();
    setToLocalStrg();
  }, [todos, filter]);

  const activeTodos = [...filteredTodos]
    .filter(todo => !todo.completed).length;

  const completedTodos = [...filteredTodos]
    .filter(todo => todo.completed).length;

  return (
    <section className="todoapp">
      <header className="header">
        <h1>React Todo</h1>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            className="new-todo"
            placeholder="What needs to be done?"
            data-cy="createTodo"
            value={input}
            onChange={e => onClickHandler(e)}
          />
        </form>
      </header>

      <section className="main">
        <input
          type="checkbox"
          id="toggle-all"
          className="toggle-all"
          data-cy="toggleAll"
          onChange={allCompletedHandler}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>

        <TodoList
          todos={filteredTodos}
          setTodos={setTodos}
          setInput={setInput}
        />
      </section>

      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count" data-cy="todosCounter">
            {activeTodos}
            {' '}
            items left
          </span>

          <TodosFilter
            todos={filteredTodos}
            setFilter={setFilter}
          />

          {completedTodos > 0 && (
            <button
              type="button"
              className="clear-completed"
              onClick={removeCompletedTodosHandler}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
});
