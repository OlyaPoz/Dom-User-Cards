'use strict';

const supportSocialNetworks = new Map()
  .set('twitter.com', './assets/icon/twitter.svg')
  .set('www.facebook.com', './assets/icon/facebook.svg')
  .set('www.instagram.com', './assets/icon/instagram.svg');

const cardContainer = document.getElementById('root'); // ul

const cards = responseData.map((user) => createUserCardElement(user)); // создаем li

cardContainer.append(...cards); // добавляем li в ul

/**
 *
 * @param {object} user
 * @returns {HTMLLIElement}
 */

function createUserCardElement(user) {
  const { firstName, lastName, description, contacts } = user;

  const h2 = createElement('h2', { classNames: ['cardName'] }, [
    document.createTextNode(`${firstName} ${lastName}`),
  ]);

  const p = createElement('p', { classNames: ['cardDescription'] }, [
    document.createTextNode(
      description ||
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.'
    ),
  ]);
  const img = createCardImage(user);
  const links = createIcons(contacts);
  const div = createElement('div', { classNames: [] }, [...links]);

  const article = createElement('article', { classNames: ['cardContainer'] }, [
    img,
    h2,
    p,
    div,
  ]);

  const wrapper = createElement('li', { classNames: ['cardWrapper'] }, [
    article,
  ]);

  return wrapper; //htmllielement
}

function createCardImage(user) {
  const { firstName, lastName, id } = user;

  const imageWrapper = document.createElement('div');
  imageWrapper.setAttribute('id', `wrapper${id}`); // устанавливаем  id для контейнер картинки
  imageWrapper.classList.add('imageWrapper');
  imageWrapper.style.backgroundColor = stringToColour(
    `${firstName} ${lastName}`
  );

  const initials = document.createElement('div');
  initials.classList.add('imagePlaceholder', 'imagePlacement');
  initials.append(document.createTextNode(firstName[0], lastName[0] || ''));

  createImage(user);

  imageWrapper.append(initials);
  return imageWrapper;
}

function createImage({ profilePicture, firstName, lastName, id }) {
  const img = document.createElement('img'); // = new Image();
  img.setAttribute('src', profilePicture);
  img.setAttribute('alt', `${firstName} ${lastName}`);
  img.dataset.id = id; // даём картинкe её id
  img.classList.add('cardImage', 'imagePlacement');
  img.addEventListener('error', imageErrorHandler);
  img.addEventListener('load', imageLoadHandler);
}

/* 
  EVENT LISTENERS
*/
function imageErrorHandler({ target }) {
  target.remove();
}

function imageLoadHandler({
  target: {
    dataset: { id },
  },
  target,
}) {
  document.getElementById(`wrapper${id}`).append(target);
}

/* 
  UTILS
*/

// DONT TRUST THIS CODE. TAKEN FROM STACKOVERFLOW
function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

/**
 *
 * @param {string} type
 * @param {object} options
 * @param {string[]} options.classNames
 * @param {function} options.onClick
 * @param {HTMLElement[]} children
 */
function createElement(type, { classNames, onClick, attributes }, children) {
  const elem = document.createElement(type);
  elem.classList.add(...classNames);
  elem.onclick = onClick;
  if (attributes) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      elem.setAttribute(attrName, attrValue);
    }
  }
  elem.onclick = onClick;
  elem.append(...children);
  return elem;
}

function createIcons(contacts) {
  const arrayOfIconElem = contacts.map((contact) => {
    const { hostname } = new URL(contact);

    if (supportSocialNetworks.has(hostname)) {
      const src = supportSocialNetworks.get(hostname);
      const img = document.createElement('img');
      img.setAttribute('src', src);
      img.classList.add('icon');
      const a = document.createElement('a');
      a.setAttribute('href', contact);
      a.setAttribute('target', '_blank');
      a.click();
      a.append(img);
      return a;
    }
    return;
  });
  return arrayOfIconElem;
}
