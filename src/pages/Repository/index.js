import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import {
  Loading,
  Owner,
  IssuesList,
  Filter,
  Pagination,
  Previous,
  Next,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    loadingNext: false,
    loadingFilter: false,
    page: 1,
    state: 'open',
  };

  async componentDidMount() {
    const { match } = this.props;

    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
      {
        params: {
          page,
          state: 'open',
        },
      },
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  componentDidUpdate(_, prevState) {
    const { issues } = this.state;

    if (prevState.issues !== issues) {
      localStorage.setItem('issues', JSON.stringify(issues));
    }
  }

  filterAll = async e => {
    e.preventDefault();

    this.setState({ loadingFilter: true });

    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          page,
          state: 'all',
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      loadingFilter: false,
      page,
      state: 'all',
    });
  };

  filterOpen = async e => {
    e.preventDefault();

    this.setState({ loadingFilter: true });

    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          page,
          state: 'open',
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      loadingFilter: false,
      page,
      state: 'open',
    });
  };

  filterClosed = async e => {
    e.preventDefault();

    this.setState({ loadingFilter: true });

    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          page,
          state: 'closed',
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      loadingFilter: false,
      page,
      state: 'closed',
    });
  };

  next = async e => {
    e.preventDefault();

    this.setState({ loadingNext: true });

    const { match } = this.props;
    const { state } = this.state;
    let { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    page += 1;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          page,
          state,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      loadingNext: false,
      page,
      state,
    });
  };

  previous = async e => {
    e.preventDefault();

    this.setState({ loadingNext: true });

    const { match } = this.props;
    const { state } = this.state;
    let { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    if (page !== 1) {
      page -= 1;
    }

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          page,
          state,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      loadingNext: false,
      page,
      state,
    });
  };

  render() {
    const {
      repository,
      issues,
      loading,
      loadingNext,
      loadingFilter,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filter onClick={this.filterAll} loadingFilter={loadingFilter}>
          All
        </Filter>
        <Filter onClick={this.filterOpen} loadingFilter={loadingFilter}>
          Open
        </Filter>
        <Filter onClick={this.filterClosed} loadingFilter={loadingFilter}>
          Closed
        </Filter>

        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
          <Pagination>
            <Previous
              type="button"
              onClick={this.previous}
              page={page}
              loadingNext={loadingNext}
            >
              Previous
            </Previous>
            <Next type="button" onClick={this.next} loadingNext={loadingNext}>
              Next
            </Next>
          </Pagination>
        </IssuesList>
      </Container>
    );
  }
}
