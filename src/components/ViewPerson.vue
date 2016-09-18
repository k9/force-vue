<template>
  <div class="mdl-cell mdl-card mdl-shadow--4dp portfolio-card">
    <mdl-button class="randPersonBtn" v-mdl-ripple-effect colored icon raised v-on:click="fetchRandomPerson">
      <i class="material-icons">face</i> Random
    </mdl-button>
    <div class="mdl-card__actions">
      <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded is-dirty">
        <div>
          <select class="full-width-select" v-model="idForName"
            v-on:change="fetchPerson">
            <option v-for="option in nameList" v-bind:value="option.value">
              {{ option.name }}
            </option>
          </select>
          <label class="mdl-textfield__label">Name</label>
        </div>
      </div>
      <mdl-textfield floating-label="Height" :value.sync="personData.height"></mdl-textfield>
      <mdl-textfield floating-label="Mass" :value.sync="personData.mass"></mdl-textfield>
      <mdl-textfield floating-label="Hair Color" :value.sync="personData.hair_color"></mdl-textfield>
      <mdl-textfield floating-label="Eye Color" :value.sync="personData.eye_color"></mdl-textfield>
      <mdl-textfield floating-label="Birth Year" :value.sync="personData.birth_year"></mdl-textfield>
      <mdl-textfield floating-label="Gender" :value.sync="personData.gender"></mdl-textfield>
    </div>
  </div>
  <div class="mdl-cell mdl-card mdl-shadow--4dp">
    <figure class="mdl-card__media">
      <div v-show="loading" class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div>
      <img v-show="imageShow" :src.sync="personImage">
      <span>{{personImageMsg}}</span>
    </figure>
  </div>
</template>

<script>
import { MdlButton, MdlTextfield, MdlSelect, directives } from 'vue-mdl';
import person from '../api/person';

export default {
  components: {
    MdlButton,
    MdlSelect,
    MdlTextfield,
  },
  directives,
  data() {
    return {
      personData: {
        name: '',
        height: '',
        mass: '',
        hair_color: '',
        eye_color: '',
        birth_year: '',
        gender: '',
      },
      personImage: '',
      personImageMsg: '',
      imageShow: false,
      loading: false,
      nameList: [],
      idForName: undefined,
    };
  },
  init() {
    person.fetchAll().then((nameList) => {
      // Unfortunately since we async loaded data,
      // closing the select menu requires an extra click due to:
      // https://github.com/posva/vue-mdl/issues/46
      this.nameList = nameList;
    });
  },
  methods: {
    fetchRandomPerson() {
      this.idForName = Math.floor((Math.random() * 87) + 1);
      this.fetchPerson();
    },
    fetchPerson() {
      this.loading = true;
      this.imageShow = false;
      this.personImageMsg = '';
      person.fetch(this.idForName).then((personData) => {
        this.personData = Object.assign(this.personData, personData);
        person.getPicture(this.personData.name).then((data) => {
          this.loading = false;
          if (data) {
            this.personImage = data;
            this.imageShow = true;
          } else {
            this.personImage = '';
            this.personImageMsg = 'No image found.';
          }
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: black;
}
figure img {
  width: 285px;
}
.mdl-card__media {
  background-color: #FFF;
}
.full-width-select {
  width: 100%;
  font-size: 24px;
  margin: 3px -2px 8px;
}
</style>
