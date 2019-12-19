/* eslint-disable consistent-return */
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
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

import { format, startOfWeek, endOfWeek } from 'date-fns';

import { toast } from 'react-toastify';

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
      startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
      duration: `00:00`,
      rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
      createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
      done: false,
      tag: '',
    },
    newSearch: format(new Date(), 'MM/dd/yyyy'),
    newSearchByTag: '',
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

    this.setState({ done: done.data.length });
    this.setState({ notDone: notDone.data.length });

    this.setChartData();

    const tasksData = tasks.data.map(task => ({
      ...task,
    }));
    this.setState({ tasks: tasksData });

    const tagsData = tags.data.map(task => task.tag);
    const noRepeatedTags = [...new Set(tagsData)];
    console.log(noRepeatedTags);
    const noEmptyTags = noRepeatedTags.filter(tag => tag !== undefined);
    console.log(noEmptyTags);
    this.setState({ tags: noEmptyTags });

    Notification.requestPermission().then(result => {
      console.log(`Notification permission: ${result}`);
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
        tag: this.state.newTask.tag,
      },
    });
  };

  handleInputChangeStartedDate = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: format(e, 'MM/dd/yyyy HH:mm'),
        duration: this.state.newTask.duration,
        rememberTime: this.state.newTask.rememberTime,
        createdDate: this.state.newTask.createdDate,
        done: false,
        tag: this.state.newTask.tag,
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
        tag: this.state.newTask.tag,
      },
    });
  };

  handleInputChangeRememberTime = e => {
    this.setState({
      newTask: {
        description: this.state.newTask.description,
        startedDate: this.state.newTask.startedDate,
        duration: this.state.newTask.duration,
        rememberTime: format(e, 'MM/dd/yyyy HH:mm'),
        createdDate: this.state.newTask.createdDate,
        done: false,
        tag: this.state.newTask.tag,
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
        createdDate: format(e, 'MM/dd/yyyy HH:mm'),
        done: false,
        tag: this.state.newTask.tag,
      },
    });
  };

  handleInputChangeTag = e => {
    console.log(e.target.value);
    console.log(e);
    console.log(typeof e.target.value);
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
          startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          duration: '00:00',
          rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
          createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          done: false,
          tag: '',
        },
        loading: false,
        error: false,
      });
    } catch (err) {
      console.log(err);
      toast.error('Invalid fields');
      this.setState({
        newTask: {
          description: '',
          startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          duration: '00:00',
          rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
          createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          done: false,
          tag: '',
        },
        loading: false,
        error: true,
      });
    }
  };

  handleChangeSearchDate = e => {
    this.setState({
      newSearch: format(e, 'MM/dd/yyyy'),
    });
    console.log(this.state.newSearch);
  };

  handleChangeTag = e => {
    this.setState({ newSearchByTag: e.target.value });
  };

  showFormAdd = e => {
    e.preventDefault();

    this.setState({
      newTask: {
        description: '',
        startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
        duration: `00:00`,
        rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
        createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
        done: false,
        tag: '',
      },
      error: false,
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

    this.setState({
      newTask: {
        description: '',
        startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
        duration: '00:00',
        rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
        createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
        done: false,
        tag: '',
      },
      error: false,
    });

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

  handleConfirmEdit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { page } = this.state;
    console.log(this.state.newTask.tag);
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
          _page: page,
          _limit: 5,
        },
      });
      console.log(response.data);
      this.setState({ tasks: response.data, loading: false, error: false });
    }
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
      error: false,
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

  // eslint-disable-next-line class-methods-use-this
  async handleSearchByDescription() {
    try {
      const tasks = await api.get('/tasks');
      const { description } = this.state.newTask;
      const similarTasks = [];

      if (description === '')
        throw new Error('Field search by description is empty');

      tasks.data.forEach(task => {
        const inputDescription = task.description;
        const expression = new RegExp(description, 'i');
        if (expression.test(inputDescription)) {
          similarTasks.push(task);
        }
      });

      if (similarTasks.length !== 0) {
        this.setState({ tasks: similarTasks });
      } else {
        this.setState({ tasks: [] });
        throw new Error('Task not found');
      }
    } catch (err) {
      console.log(err);
      toast.error('Not possible search by this description');
      this.setState({
        newTask: {
          description: '',
          startedDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          duration: `00:00`,
          rememberTime: format(new Date(), 'MM/dd/yyyy HH:mm'),
          createdDate: format(new Date(), 'MM/dd/yyyy HH:mm'),
          done: false,
          tag: '',
        },
        loading: false,
        error: true,
      });
    }
  }

  async handleSearchByDate() {
    const { newSearch } = this.state;

    console.log(newSearch);

    const data = await api.get('/tasks', {
      params: {
        done: false,
      },
    });
    console.log(data);

    // eslint-disable-next-line array-callback-return
    const tasks = data.data.filter(task => {
      let date = [];
      date = task.startedDate.split(' ');
      const startedDate = date[0];
      if (startedDate === newSearch) return task;
    });

    console.log(tasks);

    this.setState({ tasks });
  }

  async handleSearchByTag() {
    const { newSearchByTag } = this.state;

    console.log(newSearchByTag);

    const response = await api.get('/tasks', {
      params: {
        tag: `${newSearchByTag}`,
      },
    });
    console.log(response);

    this.setState({ tasks: response.data });
  }

  async handleSearchToday() {
    const data = await api.get('/tasks', {
      params: {
        done: false,
      },
    });
    console.log(data);
    const today = new Date();
    const currentDay = today.getDate();

    // eslint-disable-next-line array-callback-return
    const tasks = data.data.filter(task => {
      let date = [];
      date = task.startedDate.split('/');
      const day = date[1];
      if (day === currentDay.toString()) return task;
    });

    console.log(tasks);

    this.setState({ tasks });
  }

  async handleSearchThisweek() {
    const today = new Date();
    const startWeek = format(startOfWeek(today), 'MM/dd/yyyy HH:mm');
    const endWeek = format(endOfWeek(today), 'MM/dd/yyyy HH:mm');

    const response = await api.get('/tasks', {
      params: {
        done: false,
      },
    });

    const weekTasks = response.data.filter(
      task => task.startedDate >= startWeek && task.startedDate <= endWeek
    );

    console.log(weekTasks);

    this.setState({ tasks: weekTasks });
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

    // eslint-disable-next-line array-callback-return
    const tasks = data.data.filter(task => {
      let date = [];
      date = task.startedDate.split('/');
      const month = date[0];
      if (month === currentMonth.toString()) return task;
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
        _page: 1,
        _limit: 5,
      },
    });

    console.log(response.data);

    const tags = await api.get('/tasks');
    console.log(tags.data);
    const tagsData = tags.data.map(task => task.tag);
    const noRepeatedTags = [...new Set(tagsData)];
    console.log(noRepeatedTags);
    const noEmptyTags = noRepeatedTags.filter(tag => tag !== undefined);
    console.log(noEmptyTags);

    this.setState({
      tasks: response.data,
      tags: noEmptyTags,
      page: 1,
      limit: 5,
      final: false,
    });
  }

  render() {
    const {
      newTask,
      newSearch,
      newSearchByTag,
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
      tags,
    } = this.state;

    return (
      <Container>
        <h1 onClick={() => this.handleReload()}>
          <FaTasks />
          Tasks
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container direction="column" style={{ width: 200 }}>
              <TextField
                id="description"
                value={newTask.description}
                onChange={this.handleInputChangeDescription}
                label="Description"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                error={error}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="startedDate"
                label="Started Date"
                value={newTask.startedDate}
                onChange={this.handleInputChangeStartedDate}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="createdDate"
                label="Created Date"
                value={newTask.createdDate}
                onChange={this.handleInputChangeCreatedDate}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="remember"
                label="Remember"
                value={newTask.rememberTime}
                onChange={this.handleInputChangeRememberTime}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <TextField
                id="time"
                value={newTask.duration}
                onChange={this.handleInputChangeDuration}
                label="Duration"
                type="time"
                defaultValue="00:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                style={{ marginTop: 20 }}
              />
              <TextField
                id="tag"
                value={newTask.tag}
                onChange={this.handleInputChangeTag}
                label="Tag"
                type="text"
                defaultValue=""
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginTop: 20 }}
                error={error}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <SaveButton
            loading={loading}
            onClick={this.handleSubmit}
            style={{ marginTop: 20 }}
          >
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaSave color="#FFF" size={14} />
            )}
          </SaveButton>
        </FormAdd>

        <FormEdit onSubmit={this.handleConfirmEdit} displayEdit={displayEdit}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container direction="column" style={{ width: 200 }}>
              <TextField
                id="description"
                value={newTask.description}
                onChange={this.handleInputChangeDescription}
                label="Description"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                error={error}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="startedDate"
                label="Started Date"
                value={newTask.startedDate}
                onChange={this.handleInputChangeStartedDate}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="createdDate"
                label="Created Date"
                value={newTask.createdDate}
                onChange={this.handleInputChangeCreatedDate}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <KeyboardDateTimePicker
                variant="inline"
                ampm={false}
                id="remember"
                label="Remember"
                value={newTask.rememberTime}
                onChange={this.handleInputChangeRememberTime}
                onError={console.log}
                format="MM/dd/yyyy HH:mm"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                style={{ marginTop: 20 }}
              />
              <TextField
                id="time"
                value={newTask.duration}
                onChange={this.handleInputChangeDuration}
                label="Duration"
                type="time"
                defaultValue="00:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                style={{ marginTop: 20 }}
              />
              <TextField
                id="tag"
                value={newTask.tag}
                onChange={this.handleInputChangeTag}
                label="Tag"
                type="text"
                defaultValue=""
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ marginTop: 20, marginBottom: 10 }}
                error={error}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <SaveButton loading={loading} onClick={this.handleConfirmEdit}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <MdDoneAll color="#FFF" size={24} />
            )}
          </SaveButton>
        </FormEdit>

        <FormSearch displaySearch={displaySearch}>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container style={{ width: 300, padding: 0 }}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  value={newSearch}
                  onChange={this.handleChangeSearchDate}
                  id="searchDate"
                  label="SearchDate"
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <MdSearch size={28} onClick={() => this.handleSearchByDate()} />
          </div>

          <div>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Tag</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newSearchByTag}
                onChange={this.handleChangeTag}
                style={{ width: 100 }}
              >
                {tags.map(tag => (
                  <MenuItem value={tag}>{tag}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <MdSearch size={28} onClick={() => this.handleSearchByTag()} />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Description..."
              value={newTask.description}
              onChange={this.handleInputChangeDescription}
              error={error}
            />
            <MdSearch
              size={28}
              onClick={() => this.handleSearchByDescription()}
            />
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
