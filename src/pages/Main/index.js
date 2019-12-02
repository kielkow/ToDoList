/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
import { MdEdit, MdDelete, MdSearch, MdDoneAll } from 'react-icons/md';
// import { startOfWeek, endOfWeek } from 'date-fns';

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
  FormEdit,
  FormSearch,
  SaveButton,
  SearchTodayButton,
  SearchMonthButton,
  SearchWeekButton,
  SearchAllDoneButton,
} from './styles';

export default class Main extends Component {
  state = {
    newTask: {
      description: '',
      startedDate: '',
      duration: '',
      rememberTime: '',
      createdDate: '',
      done: false,
      tag: '',
    },
    newSearch: {
      day: '',
      month: '',
      year: '',
    },
    tasks: [],
    loading: false,
    error: false,
    displayAdd: false,
    displayEdit: false,
    idTaskEdited: '',
    displaySearch: false,
    done: true,
    days: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
    ],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
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
        done: false,
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
        done: false,
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
        done: false,
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
        done: false,
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
        done: false,
      },
    });
  };

  handleInputChangeTag = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
        done: false,
        tag: e.target.value,
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

      if (newTask.tag === '') throw new Error('Field tag empty');

      const checkTaskExists = tasks.find(
        task => task.description === newTask.description
      );

      if (checkTaskExists) throw new Error('Task already exists');

      const data = newTask;

      console.log(data);

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
          tag: '',
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
          done: false,
          tag: '',
        },
        loading: false,
        error: true,
      });
    }
  };

  handleChangeDay = async e => {
    this.setState({
      newSearch: {
        day: e.target.value,
        month: this.state.newSearch.month,
        year: this.state.newSearch.year,
      },
    });
  };

  handleChangeMonth = async e => {
    this.setState({
      newSearch: {
        day: this.state.newSearch.day,
        month: e.target.value,
        year: this.state.newSearch.year,
      },
    });
  };

  handleChangeYear = e => {
    this.setState({
      newSearch: {
        day: this.state.newSearch.day,
        month: this.state.newSearch.month,
        year: e.target.value,
      },
    });
  };

  showFormAdd = e => {
    e.preventDefault();

    const { displayAdd } = this.state;

    displayAdd
      ? this.setState({
          displayAdd: false,
          displaySearch: false,
          displayEdit: false,
        })
      : this.setState({
          displayAdd: true,
          displaySearch: false,
          displayEdit: false,
        });
  };

  showFormSearch = e => {
    e.preventDefault();

    const { displaySearch } = this.state;

    displaySearch
      ? this.setState({
          displaySearch: false,
          displayAdd: false,
          displayEdit: false,
        })
      : this.setState({
          displaySearch: true,
          displayAdd: false,
          displayEdit: false,
        });
  };

  handleEdit(taskId) {
    console.log(taskId);
    this.setState({ idTaskEdited: taskId });

    const { displayEdit } = this.state;

    displayEdit
      ? this.setState({
          displayAdd: false,
          displaySearch: false,
          displayEdit: false,
        })
      : this.setState({
          displayAdd: false,
          displaySearch: false,
          displayEdit: true,
        });
  }

  async handleConfirmEdit() {
    // eslint-disable-next-line no-alert
    const confirmDone = window.confirm('Do you want edit this task?');
    const { idTaskEdited } = this.state;
    console.log(this.state.newTask);
    if (confirmDone) {
      await api.put(`/tasks/${idTaskEdited}`, {
        id: idTaskEdited,
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
        done: false,
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

  async handleSearch() {
    const { newSearch } = this.state;

    console.log(newSearch);

    const response = await api.get('/tasks', {
      params: {
        startedDate: `${newSearch.day}/${newSearch.month}/${newSearch.year}`,
      },
    });

    console.log(response);

    this.setState({ tasks: response.data });
  }

  async handleSearchToday() {
    const today = new Date();

    const response = await api.get('/tasks', {
      params: {
        startedDate: `${today.getDate()}/${today.getMonth() +
          1}/${today.getFullYear()}`,
        done: false,
      },
    });

    console.log(response);

    this.setState({ tasks: response.data });
  }

  async handleSearchThisweek() {
    const today = new Date();

    const response = await api.get('/tasks', {
      params: {
        startedDate: `${today.getDate()}/${today.getMonth() +
          1}/${today.getFullYear()}`,
      },
    });

    console.log(response);

    this.setState({ tasks: response.data });
  }

  async handleSearchThisMonth() {
    const data = await api.get('/tasks', {
      params: {
        done: false,
      },
    });
    console.log(data);
    const today = new Date();
    const currentMonth = today.getMonth() + 1;

    const tasks = data.data.filter(task => {
      if (task.startedDate.length === 9) {
        const monthTask = task.startedDate.slice(2, 4);
        if (Number(monthTask) === currentMonth) {
          return task;
        }
      }
      if (task.startedDate.length > 9) {
        const monthTask = task.startedDate.slice(3, 5);
        if (Number(monthTask) === currentMonth) {
          return task;
        }
      }
      const monthTask = task.startedDate.slice(2, 3);
      if (Number(monthTask) === currentMonth) {
        return task;
      }
      return '';
    });

    console.log(tasks);

    this.setState({ tasks });
  }

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

  async handleReload() {
    const response = await api.get('/tasks', {
      params: {
        done: false,
      },
    });

    console.log(response.data);

    this.setState({ tasks: response.data });
  }

  render() {
    const {
      newTask,
      tasks,
      loading,
      error,
      displayAdd,
      displayEdit,
      displaySearch,
      days,
      months,
      years,
    } = this.state;

    return (
      <Container>
        <h1 onClick={() => this.handleReload()}>
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
          <Input
            type="text"
            placeholder="#..."
            value={newTask.tag}
            onChange={this.handleInputChangeTag}
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

        <FormEdit displayEdit={displayEdit}>
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
          <SaveButton
            loading={loading}
            onClick={() => this.handleConfirmEdit()}
          >
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <MdDoneAll color="#FFF" size={24} />
            )}
          </SaveButton>
        </FormEdit>

        <FormSearch displaySearch={displaySearch}>
          <div>
            <span>Day</span>
            <select onChange={this.handleChangeDay}>
              {days.map(day => (
                <option
                  value={day}
                  onChange={this.handleInputChangeDescription}
                >
                  {day}
                </option>
              ))}
            </select>

            <span>Month</span>
            <select onChange={this.handleChangeMonth}>
              {months.map(month => (
                <option value={month}>{month}</option>
              ))}
            </select>

            <span>Year</span>
            <select onChange={this.handleChangeYear}>
              {years.map(year => (
                <option value={year}>{year}</option>
              ))}
            </select>
            <MdSearch size={28} onClick={() => this.handleSearch()} />
          </div>

          <div>
            <SearchTodayButton onClick={() => this.handleSearchToday()}>
              Today
            </SearchTodayButton>
            <SearchWeekButton onClick={() => this.handleSearchThisweek()}>
              This Week
            </SearchWeekButton>
            <SearchMonthButton onClick={() => this.handleSearchThisMonth()}>
              This Month
            </SearchMonthButton>
            <SearchAllDoneButton onClick={() => this.handleAllDone()}>
              All tasks done
            </SearchAllDoneButton>
          </div>
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
              <input type="text" disabled value={task.description} />

              <input type="text" disabled value={task.startedDate} />

              <input type="text" disabled value={task.duration} />

              <input type="text" disabled value={task.rememberTime} />

              <input type="text" disabled value={task.createdDate} />

              <MdEdit size={22} onClick={() => this.handleEdit(task.id)} />

              <MdDelete size={22} onClick={() => this.handleDelete(task)} />
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
