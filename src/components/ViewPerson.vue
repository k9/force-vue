<template>
  <div class="mdl-card mdl-shadow--4dp portfolio-card">
    <mdl-button class="randPersonBtn" v-mdl-ripple-effect colored icon raised v-on:click="fetchRandomPerson">
      <i class="material-icons">face</i> Random
    </mdl-button>
    <div class="mdl-card__actions">
      <mdl-select label="Name" id="people-select" class="full-width-select"
        :value.sync="personData.name" :options="nameList"></mdl-select>
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
    };
  },
  init() {
    person.fetchAll().then((nameList) => {
      this.nameList = nameList;
    });
  },
  methods: {
    fetchRandomPerson() {
      this.loading = true;
      this.imageShow = false;
      this.personImageMsg = '';
      const randomPersonId = Math.floor((Math.random() * 87) + 1);
      person.fetch(randomPersonId).then((personData) => {
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
}
</style>
