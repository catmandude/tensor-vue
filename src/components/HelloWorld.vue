<template>
  <v-container>
    <v-layout align-center justify-center row fill-height>
    <v-layout column>
      <v-flex xs12>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>
        <v-flex xs8>
          <scatter-chart :data="allCars" xtitle="Horse Power" ytitle="MPG"></scatter-chart>
        </v-flex>
<!--        <div class="cars" v-for="car in allCars" :key="car.Name">{{ car.mpg }}</div>-->
      </v-flex>
    </v-layout>
  </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['fetchCars'])
    // ...mapActions(['convertToTensor'])
  },
  computed: mapGetters(['allCars']),
  created () {
    this.fetchCars()
    // this.createModel()
    // this.convertToTensor()
  },
  watch: {
    allCars: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    }
  }
}
</script>

<style>

</style>
