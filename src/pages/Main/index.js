/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import {
  FaPlus,
  FaSpinner,
  FaTasks,
  FaSearch,
  FaSave,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdEdit, MdDelete, MdDoneAll } from 'react-icons/md';
import { FiThumbsUp } from 'react-icons/fi';
import { AiOutlineFileSearch } from 'react-icons/ai';

import api from '../../services/api';

import Container from '../../components/Container';
import {
  Form,
  SubmitButton,
  SearchButton,
  List,
  Input,
  HeaderList,
  FormAdd,
  FormSearch,
  SaveButton,
  EditButton,
} from './styles';

export default class Main extends Component {
  state = {
    newTask: {
      description: '',
      startedDate: '',
      duration: '',
      rememberTime: '',
      createdDate: '',
    },
    tasks: [],
    loading: false,
    error: false,
    displayAdd: false,
    displaySearch: false,
    readOnly: true,
    confirmEdit: false,
    done: true,
  };

  // Carregar os dados do localStorage
  async componentDidMount() {
    const response = await api.get('/tasks', {
      params: {
        done: false,
      },
    });

    console.log(response.data);

    const data = response.data.map(task => ({
      ...task,
    }));

    this.setState({ tasks: data });
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { tasks } = this.state;

    if (prevState.tasks !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  handleInputChangeDescription = e => {
    this.setState({
      newTask: {
        description: e.target.value,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
      },
    });
  };

  handleInputChangeStartedDate = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: e.target.value,
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
      },
    });
  };

  handleInputChangeDuration = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: e.target.value,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
      },
    });
  };

  handleInputChangeRememberTime = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: e.target.value,
        createdDate: this.state.newTask.createdDate,
      },
    });
  };

  handleInputChangeCreatedDate = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: e.target.value,
      },
    });
  };

  handleSubmit = async e => {
    try {
      e.preventDefault();

      this.setState({ loading: true });

      const { newTask, tasks } = this.state;

      console.log(newTask);

      if (newTask.description === '')
        throw new Error('Field description empty');

      if (newTask.startedDate === '')
        throw new Error('Field startedDate empty');

      if (newTask.duration === '') throw new Error('Field duration empty');

      if (newTask.rememberTime === '')
        throw new Error('Field rememberTime empty');

      if (newTask.createdDate === '')
        throw new Error('Field createdDate empty');

      const checkTaskExists = tasks.find(
        task => task.description === newTask.description
      );

      if (checkTaskExists) throw new Error('Task alreadOnlyy exists');

      const data = newTask;

      await api.post('/tasks', data);

      this.setState({
        tasks: [...tasks, data],
        newTask: {
          description: '',
          startedDate: '',
          duration: '',
          rememberTime: '',
          createdDate: '',
          done: false,
        },
        loading: false,
        error: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        newTask: {
          description: '',
          startedDate: '',
          duration: '',
          rememberTime: '',
          createdDate: '',
        },
        loading: false,
        error: true,
      });
    }
  };

  handleSearch = async e => {
    e.preventDefault();

    this.setState({ loading: true });
  };

  showFormAdd = async e => {
    e.preventDefault();

    const { displayAdd } = this.state;

    displayAdd
      ? this.setState({ displayAdd: false, displaySearch: false })
      : this.setState({ displayAdd: true, displaySearch: false });
  };

  showFormSearch = async e => {
    e.preventDefault();

    const { displaySearch } = this.state;

    displaySearch
      ? this.setState({ displaySearch: false, displayAdd: false })
      : this.setState({ displaySearch: true, displayAdd: false });
  };

  handleEdit = () => {
    this.setState({ confirmEdit: true, readOnly: false });
  };

  handleConfirmEdit = () => {
    this.setState({ confirmEdit: false, readOnly: true });
  };

  async handleAllDone() {
    const { done } = this.state;

    done ? this.setState({ done: false }) : this.setState({ done: true });

    const response = await api.get('/tasks', {
      params: {
        done,
      },
    });

    console.log(response.data);

    this.setState({ tasks: response.data });
  }

  async handleDone(task) {
    // eslint-disable-next-line no-alert
    const confirmDone = window.confirm('Do you want complete this task?');
    if (confirmDone) {
      await api.put(`/tasks/${task.id}`, {
        id: task.id,
        description: task.description,
        startedDate: task.startedDate,
        duration: task.duration,
        rememberTime: task.rememberTime,
        createdDate: task.createdDate,
        done: true,
      });
      const response = await api.get('/tasks', {
        params: {
          done: false,
        },
      });
      console.log(response);
      this.setState({ tasks: response.data });
    }
  }

  async handleDelete(task) {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm('Do you want delete this task?');
    if (confirmDelete) {
      await api.delete(`/tasks/${task.id}`);
      const response = await api.get('/tasks');
      console.log(response);
      this.setState({ tasks: response.data });
    }
  }

  render() {
    const {
      newTask,
      tasks,
      loading,
      error,
      displayAdd,
      displaySearch,
      readOnly,
      confirmEdit,
    } = this.state;

    return (
      <Container>
        <h1>
          <FaTasks />
          Taks
        </h1>

        <Form>
          <SubmitButton loading={loading} onClick={this.showFormAdd}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>

          <SearchButton loading={loading} onClick={this.showFormSearch}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSearch color="#FFF" size={14} />
            )}
          </SearchButton>
        </Form>

        <FormAdd onSubmit={this.handleSubmit} displayAdd={displayAdd}>
          <Input
            type="text"
            placeholder="Description..."
            value={newTask.description}
            onChange={this.handleInputChangeDescription}
            error={error}
          />
          <Input
            type="text"
            placeholder="Started date..."
            value={newTask.startedDate}
            onChange={this.handleInputChangeStartedDate}
            error={error}
          />
          <Input
            type="text"
            placeholder="Duration..."
            value={newTask.duration}
            onChange={this.handleInputChangeDuration}
            error={error}
          />
          <Input
            type="text"
            placeholder="Remember time..."
            value={newTask.rememberTime}
            onChange={this.handleInputChangeRememberTime}
            error={error}
          />
          <Input
            type="text"
            placeholder="Created date..."
            value={newTask.createdDate}
            onChange={this.handleInputChangeCreatedDate}
            error={error}
          />
          <SaveButton loading={loading} onClick={this.handleSubmit}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSave color="#FFF" size={14} />
            )}
          </SaveButton>
        </FormAdd>

        <FormSearch onSubmit={this.handleSearch} displaySearch={displaySearch}>
          <Input
            type="text"
            placeholder="Description..."
            value={newTask.description}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Started Date..."
            value={newTask.startedDate}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Duration..."
            value={newTask.duration}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Remember time..."
            value={newTask.rememberTime}
            onChange={this.handleInputChange}
            error={error}
          />
          <Input
            type="text"
            placeholder="Created date..."
            value={newTask.createdDate}
            onChange={this.handleInputChangeCreatedDate}
            error={error}
          />

          <SaveButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <AiOutlineFileSearch color="#FFF" size={14} />
            )}
          </SaveButton>

          <MdDoneAll size={28} onClick={() => this.handleAllDone()} />
        </FormSearch>

        <List>
          <HeaderList>
            <span>Description</span>
            <span>Started</span>
            <span>Duration</span>
            <span>Remember</span>
            <span>Created</span>
          </HeaderList>
          {tasks.map(task => (
            <li key={task.id}>
              <FaCheckCircle size={18} onClick={() => this.handleDone(task)} />
              <input
                type="text"
                value={readOnly ? task.description : null}
                readOnly={readOnly}
                done={task.done}
              />

              <input
                type="text"
                value={readOnly ? task.startedDate : null}
                readOnly={readOnly}
                done={task.done}
              />

              <input
                type="text"
                value={readOnly ? task.duration : null}
                readOnly={readOnly}
                done={task.done}
              />

              <input
                type="text"
                value={readOnly ? task.rememberTime : null}
                readOnly={readOnly}
                done={task.done}
              />

              <input
                type="text"
                value={readOnly ? task.createdDate : null}
                readOnly={readOnly}
                done={task.done}
              />

              <EditButton confirmEdit={confirmEdit}>
                {confirmEdit ? (
                  <FiThumbsUp
                    size={22}
                    onClick={() => this.handleConfirmEdit()}
                  />
                ) : (
                  <MdEdit size={22} onClick={() => this.handleEdit()} />
                )}
              </EditButton>

              <MdDelete size={22} onClick={() => this.handleDelete(task)} />
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
