import axios from 'axios';
import config from './config';

export const get = url => axios.get(url, { headers });

export const post = (url, data) => axios.post(url, data, { headers });

const headers = {
  'Authorization': 'Bearer ' + getToken()
}

function getToken() {
  return localStorage.getItem('token');
}

export const init = () => {
  const url = `${config.server}/api/init`;
  return get(url);
}

export const createDebate = () => {
  const url = `${config.server}/api/debate/create`;
  const payload = {
    topic: 'What came first, the chicken or the egg?',
    forPosition: 'Chicken',
    againstPosition: 'Egg',
    currentDebate: true,
  }
  return post(url, payload);
}

export const upvoteDebate = payload => {
  const url = `${config.server}/api/debate/upvote`;
  return post(url, payload);
}