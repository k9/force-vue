import Vue from 'vue';
import { EventEmitter } from 'events';
import { Promise } from 'es6-promise';

const personCache = Object.create(null);
const nameList = [];
const pictureCache = Object.create(null);
const person = new EventEmitter();
const personBaseUrl = 'people/';
export default person;

person.fetch = id => {
  if (!id) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    if (personCache[id]) {
      resolve(personCache[id]);
    }
    const personToGet = `${personBaseUrl}${id}/`;
    Vue.http.get(personToGet).then(response => {
      const personData = personCache[id] = response.data;
      resolve(personData);
    }, reject);
  });
};

person.fetchAll = () =>
  new Promise(resolve =>
    person.fetchPage(resolve, 1));

person.fetchPage = (resolve, pageNumber) => {
  const pageToGet = `${personBaseUrl}?page=${pageNumber}`;
  Vue.http.get(pageToGet).then(response => {
    for (const result of response.data.results) {
      const pathSegments = result.url.split('/');
      const id = pathSegments[pathSegments.length - 2];
      personCache[id] = result;
      nameList.push({
        name: result.name,
        value: id,
      });
    }

    if (response.data.next) {
      person.fetchPage(resolve, pageNumber + 1);
    } else {
      resolve(nameList);
    }
  });
};

person.getPicture = searchWord => {
  if (!searchWord) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    if (pictureCache[searchWord]) {
      resolve(pictureCache[searchWord]);
    }
    const param = {
      q: searchWord,
      q_type: 'jpg',
    };
    Vue.http.headers.common.Authorization = '';
    Vue.http.get(process.env.IMAGE_HOST, param, {
      headers: {
        Authorization: process.env.IMGUR_CLIENT_ID,
      },
    }).then(response => {
      let imgUrl = null;
      if (typeof response.data === 'undefined' || typeof response.data.data[0] === 'undefined') {
        imgUrl = null;
      } else if (typeof response.data.data[0].cover !== 'undefined') {
        imgUrl = 'http://i.imgur.com/'.concat(response.data.data[0].cover, 'm.jpg');
      } else if (typeof response.data.data[0].link !== 'undefined') {
        imgUrl = response.data.data[0].link.replace(/\.jpg$/, 'm.jpg');
      }
      resolve(imgUrl);
    }, reject);
  });
};
