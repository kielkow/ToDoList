import React, { Component } from 'react';
import { FaPlus, FaSpinner, FaTasks, FaSearch, FaSave } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

// import api from '../../services/api';

import Container from '../../components/Container';
import {
  Form,
  SubmitButton,
  SearchButton,
  List,
  Input,
  HeaderList,
  FormAdd,
  SaveButton,
} from './styles';

export default class Main extends Component {
  state = {
    newTask: '',
    tasks: [],
    loading: false,
    error: false,
    display: true,
  };

  // Carregar os dados do localStorage
  componentDidMount() {
    const tasks = localStorage.getItem('tasks');

    if (tasks) {
      this.setState({ tasks: JSON.parse(tasks) });
    }
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { tasks } = this.state;

    if (prevState.tasks !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  handleInputChange = e => {
    this.setState({ newTask: e.target.value });
  };

  handleSubmit = async e => {
    try {
      e.preventDefault();

      this.setState({ loading: true });

      const { newTask, tasks } = this.state;

      if (newTask === '') throw new Error('Field empty');

      const checkTaskExists = tasks.find(task => task === newTask);

      if (checkTaskExists) throw new Error('Task already exists');

      const data = newTask;

      this.setState({
        tasks: [...tasks, data],
        newTask: '',
        loading: false,
        error: false,
        display: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        newTask: '',
        loading: false,
        error: true,
      });
    }
  };

  render() {
    const { newTask, tasks, loading, error, display } = this.state;

    return (
      <Container>
        <h1>
          <FaTasks />
          Taks
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            placeholder="Add a task..."
            value={newTask}
            onChange={this.handleInputChange}
            error={error}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>

          <SearchButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSearch color="#FFF" size={14} />
            )}
          </SearchButton>
        </Form>

        <FormAdd display={display}>
          <Input
            type="text"
            placeholder="Description..."
            value={newTask}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Started Date..."
            value={newTask}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Duration..."
            value={newTask}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Remember time..."
            value={newTask}
            onChange={this.handleInputChange}
            error={error}
          />
          <SaveButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSave color="#FFF" size={14} />
            )}
          </SaveButton>
        </FormAdd>

        <List>
          <HeaderList>
            <span>Description</span>
            <span>Started Date</span>
            <span>Duration</span>
            <span>Remember Time</span>
            <span>Created Date</span>
          </HeaderList>
          {tasks.map(task => (
            <li key={task}>
              <span>{task}</span>
              <span>{task}</span>
              <span>{task}</span>
              <span>{task}</span>
              <span>{task}</span>
              <Link to={`/task/${encodeURIComponent(task.id)}`}>
                <MdEdit size={22} />
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
