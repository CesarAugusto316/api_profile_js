import axios from 'axios';
// 890827972238528572

/**
 * @typedef {object} UserProfile
 *    @property {string} username
 *    @property {string} fullName
 *    @property {Array} hobbies
 *    @property {number} level
 *    @property {number} batch
 *    @property {string} createdAt
 *    @property {string} email
 *    @property {string} lastLogin
 *    @property {string} avatar
 */

class FormView {
  _apiUrl = 'https://larnu-api-upy5mhs63a-rj.a.run.app/api/v1/bootcamp/profile';
  /** @type {HTMLInputElement} */
  _discordInput = document.querySelector('#discord-id');
  /** @type {HTMLInputElement} */
  _emailInput = document.querySelector('#email');
  /** @type {HTMLDivElement} */
  _modal = document.querySelector('.modal');
  /** @type {HTMLDivElement} */
  _card = document.querySelector('.card');
  _container = document.querySelector('.main');
  /** @type {HTMLFormElement} */
  _formBtn = document.querySelector('.form');
  _spinner = document.querySelector('.spinner-container');


  constructor() {
    this._modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this._modal.classList.add('hidden');
        this._formBtn.classList.remove('hidden');
      }
    });

    this._modal.addEventListener('click', (e) => {
      // @ts-ignore
      if (!e.target.closest('.card')) {
        this._modal.classList.add('hidden');
        this._formBtn.classList.remove('hidden');
      }
    });

    this._formBtn.addEventListener('submit', (e) => {
      e.preventDefault();
      this._spinner.classList.remove('hidden');
      this._formBtn.classList.add('hidden');

      this.fetchUserProfile(this._discordInput.value, this._emailInput.value)
        .then((userProfile) => {
          this._spinner.classList.add('hidden');
          this._modal.classList.remove('hidden');
          this._createUserProfile(userProfile);
        })
        .catch((error) => {
          console.log(error.message);
          return error;
        });
    });
  }

  /**
   *
   * @param {UserProfile} userProfile
   */
  _createUserProfile({
    fullName, avatar, batch, createdAt, email, hobbies, lastLogin, level, username,
  }) {
    const markup = `
      <figure class="image-box">
        <img class="user__image" src=${avatar} alt=${`${fullName}-photo`}>
      </figure>
       
      <div class="user__content">
        <div><span class="user__info">Fullname</span><span>${fullName}</span></div>
        <div><span class="user__info">Email</span><span>${email}</span></div>
        <div><span class="user__info">Hobbies</span><span>${hobbies || 0}</span></div>
        <div><span class="user__info">Last login</span><span>${new Date(lastLogin).toDateString()}</span></div>
        <div><span class="user__info">Batch</span><span>${batch}</span></div>
        <div><span class="user__info">Created at</span><span>${new Date(createdAt).toDateString()}</span></div>
        <div><span class="user__info">Level</span><span>${level}</span></div>
        <div><span class="user__info">Username</span><span>${username}</span></div>
      </div>
    `;
    this._card.innerHTML = markup;
  }

  /**
   *
   * @param {string} discordId
   * @param {string} emailInput
   * @return {Promise<UserProfile>}
   */
  async fetchUserProfile(discordId, emailInput) {
    try {
      const { data } = await axios.get(this._apiUrl, {
        headers: {
          Email: emailInput.trim(),
          'Discord-id': discordId.trim(),
        },
      });
      const {
        discordUsername: username, batch, hobbies, level, user: {
          createdAt, email, lastLogin, fullName, avatar,
        },
      } = data;
      console.log(data);
      return {
        username, batch, hobbies, level, createdAt, email, lastLogin, fullName, avatar,
      };
    } catch (error) {
      return error.message;
    }
  }
}

const app = new FormView();
