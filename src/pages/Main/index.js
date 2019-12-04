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
import { GoGraph } from 'react-icons/go';

// import { startOfWeek, endOfWeek } from 'date-fns';

import api from '../../services/api';

import Container from '../../components/Container';
import Chart from '../../components/Chart/index';

import {
  Form,
  SubmitButton,
  SearchButton,
  GraphButton,
  List,
  Input,
  HeaderList,
  FormAdd,
  FormEdit,
  FormSearch,
  FormChart,
  SaveButton,
  SearchTodayButton,
  SearchMonthButton,
  SearchWeekButton,
  SearchAllDoneButton,
  Pagination,
  Previous,
  Next,
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
      tag: '',
    },
    tasks: [],
    tags: [],
    loading: false,
    error: false,
    displayAdd: false,
    displayEdit: false,
    idTaskEdited: '',
    displaySearch: false,
    displayChart: false,
    done: 0,
    notDone: 0,
    page: 1,
    limit: 5,
    final: false,
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
    chartData: {
      labels: ['Done', 'Not Done'],
      datasets: [
        {
          label: 'tasks',
          data: [4, 7],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
        },
      ],
    },
    chartDataBar: {
      labels: ['School', 'Family', 'Job', 'Friends'],
      datasets: [
        {
          label: 'Tasks solved by tag',
          data: [3, 2, 4, 1],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(54, 15, 235, 0.6)',
            'rgba(54, 80, 80, 0.6)',
            'rgba(120, 80, 10, 0.6)',
          ],
        },
      ],
    },
  };

  // Carregar os dados do localStorage
  async componentDidMount() {
    const [done, notDone, tasks, tags] = await Promise.all([
      api.get('/tasks', {
        params: {
          done: true,
        },
      }),
      api.get('/tasks', {
        params: {
          done: false,
        },
      }),
      api.get('/tasks', {
        params: {
          done: false,
          _page: this.state.page,
          _limit: this.state.limit,
        },
      }),
      api.get('/tasks'),
    ]);

    console.log(done.data);
    console.log(notDone.data);
    console.log(tasks.data);
    console.log(tags.data);

    this.setState({ done: done.data.length });
    console.log(this.state.done);
    this.setState({ notDone: notDone.data.length });
    console.log(this.state.notDone);

    this.setChartData();

    const tasksData = tasks.data.map(task => ({
      ...task,
    }));
    this.setState({ tasks: tasksData });

    const tagsData = tags.data.map(task => task.tag);
    const noRepeatedTags = [...new Set(tagsData)];
    console.log(noRepeatedTags);
    this.setState({ tags: noRepeatedTags });

    Notification.requestPermission().then(result => {
      console.log(result);
    });
  }

  // Salvar os dados do localStorage
  componentDidUpdate(_, prevState) {
    const { tasks } = this.state;

    if (prevState.tasks !== tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  setChartData() {
    console.log(this.state.chartData);
    this.setState({
      chartData: {
        labels: ['Done', 'Not Done'],
        datasets: [
          {
            label: 'tasks',
            data: [this.state.done, this.state.notDone],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      },
    });
    this.setState({
      chartDataBar: {
        labels: ['Job', 'School', 'Family', 'Mine', 'Friends'],
        datasets: [
          {
            label: 'Tasks',
            data: [2, 4, 1, 2, 2],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(54, 15, 235, 0.6)',
              'rgba(54, 80, 80, 0.6)',
              'rgba(120, 80, 10, 0.6)',
              'rgba(30, 130, 15, 0.6)',
            ],
          },
        ],
      },
    });
    console.log(this.state.chartData);
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

      const checkTaskExists = tasks.find(
        task => task.description === newTask.description
      );

      if (checkTaskExists) throw new Error('Task already exists');

      const data = newTask;

      console.log(data);

      await api.post('/tasks', data);

      // eslint-disable-next-line no-new
      new Notification(`Tarefa ${data.description} criada`);

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
        tag: this.state.newSearch.tag,
      },
    });
  };

  handleChangeMonth = async e => {
    this.setState({
      newSearch: {
        day: this.state.newSearch.day,
        month: e.target.value,
        year: this.state.newSearch.year,
        tag: this.state.newSearch.tag,
      },
    });
  };

  handleChangeYear = e => {
    this.setState({
      newSearch: {
        day: this.state.newSearch.day,
        month: this.state.newSearch.month,
        year: e.target.value,
        tag: this.state.newSearch.tag,
      },
    });
  };

  handleChangeTag = e => {
    this.setState({
      newSearch: {
        day: this.state.newSearch.day,
        month: this.state.newSearch.month,
        year: this.state.newSearch.year,
        tag: e.target.value,
      },
    });
  };

  showFormAdd = e => {
    e.preventDefault();

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
    });

    const { displayAdd } = this.state;

    displayAdd
      ? this.setState({
          displayAdd: false,
          displaySearch: false,
          displayEdit: false,
          displayChart: false,
        })
      : this.setState({
          displayAdd: true,
          displaySearch: false,
          displayEdit: false,
          displayChart: false,
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
          displayChart: false,
        })
      : this.setState({
          displaySearch: true,
          displayAdd: false,
          displayEdit: false,
          displayChart: false,
        });
  };

  showFormGraph = e => {
    e.preventDefault();

    console.log(this.state.chartData);

    this.setChartData();

    const { displayChart } = this.state;

    displayChart
      ? this.setState({
          displaySearch: false,
          displayAdd: false,
          displayEdit: false,
          displayChart: false,
        })
      : this.setState({
          displaySearch: false,
          displayAdd: false,
          displayEdit: false,
          displayChart: true,
        });
  };

  next = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    let { page } = this.state;

    page += 1;

    this.setState({ page });

    const response = await api.get('/tasks', {
      params: {
        done: false,
        _page: page,
        _limit: 5,
      },
    });

    if (response.data.length !== 0) {
      this.setState({ tasks: response.data, loading: false });
    } else {
      page -= 1;

      this.setState({ page });

      this.setState({ final: true, loading: false });
    }
  };

  previous = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    let { page } = this.state;

    if (page !== 1) {
      page -= 1;
    }

    this.setState({ page });

    const response = await api.get('/tasks', {
      params: {
        done: false,
        _page: page,
        _limit: 5,
      },
    });

    this.setState({ tasks: response.data, loading: false, final: false });
  };

  handleEdit(task) {
    console.log(task.id);
    this.setState({ idTaskEdited: task.id });

    this.setState({
      newTask: {
        description: task.description,
        startedDate: task.startedDate,
        duration: task.duration,
        rememberTime: task.rememberTime,
        createdDate: task.createdDate,
        done: task.done,
        tag: task.tag,
      },
    });

    const { displayEdit } = this.state;

    displayEdit
      ? this.setState({
          displayAdd: false,
          displaySearch: false,
          displayEdit: false,
          displayChart: false,
        })
      : this.setState({
          displayAdd: false,
          displaySearch: false,
          displayChart: false,
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
        tag: this.state.newTask.tag,
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

    if (
      newSearch.day === '' &&
      newSearch.month === '' &&
      newSearch.year === ''
    ) {
      const response = await api.get('/tasks', {
        params: {
          tag: newSearch.tag,
        },
      });
      console.log(response);

      this.setState({ tasks: response.data });
    } else {
      const response = await api.get('/tasks', {
        params: {
          startedDate: `${newSearch.day}/${newSearch.month}/${newSearch.year}`,
        },
      });
      console.log(response);

      this.setState({ tasks: response.data });
    }
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
    const response = await api.get('/tasks', {
      params: {
        done: true,
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
        tag: task.tag,
      });
      const response = await api.get('/tasks', {
        params: {
          done: false,
          _page: this.state.page,
          _limit: this.state.limit,
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
      const response = await api.get('/tasks', {
        params: {
          done: false,
          _page: this.state.page,
          _limit: this.state.limit,
        },
      });
      console.log(response);
      this.setState({ tasks: response.data });
    }
  }

  async handleReload() {
    const response = await api.get('/tasks', {
      params: {
        done: false,
        _page: this.state.page,
        _limit: this.state.limit,
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
      displayChart,
      chartData,
      chartDataBar,
      page,
      final,
      days,
      months,
      years,
      tags,
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

          <GraphButton loading={loading} onClick={this.showFormGraph}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <GoGraph color="#FFF" size={16} />
            )}
          </GraphButton>
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
          <Input
            type="text"
            placeholder="#Tag..."
            value={newTask.tag}
            onChange={this.handleInputChangeTag}
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
              <option value="">None</option>
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
              <option value="">None</option>
              {months.map(month => (
                <option value={month}>{month}</option>
              ))}
            </select>

            <span>Year</span>
            <select onChange={this.handleChangeYear}>
              <option value="">None</option>
              {years.map(year => (
                <option value={year}>{year}</option>
              ))}
            </select>

            <span>#Tag</span>
            <select onChange={this.handleChangeTag}>
              <option value="">None</option>
              {tags.map(tag => (
                <option value={tag}>{tag}</option>
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

        <FormChart displayChart={displayChart}>
          <Chart chartData={chartData} chartDataBar={chartDataBar} />
        </FormChart>

        <List>
          <HeaderList>
            <span>Description</span>
            <span>Started</span>
            <span>Duration</span>
            <span>Remember</span>
            <span>Created</span>
            <span>#Tag</span>
          </HeaderList>
          {tasks.map(task => (
            <li key={task.id}>
              <FaCheckCircle size={18} onClick={() => this.handleDone(task)} />
              <input type="text" disabled value={task.description} />

              <input type="text" disabled value={task.startedDate} />

              <input type="text" disabled value={task.duration} />

              <input type="text" disabled value={task.rememberTime} />

              <input type="text" disabled value={task.createdDate} />

              <input type="text" disabled value={task.tag} />

              <MdEdit size={22} onClick={() => this.handleEdit(task)} />

              <MdDelete size={22} onClick={() => this.handleDelete(task)} />
            </li>
          ))}
          <Pagination>
            <Previous
              type="button"
              onClick={this.previous}
              page={page}
              loading={loading}
            >
              Previous
            </Previous>
            <Next
              type="button"
              onClick={this.next}
              loading={loading}
              final={final}
            >
              Next
            </Next>
          </Pagination>
        </List>
      </Container>
    );
  }
}
