import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { convertToTensor, createModel, testModel } from './services/tensor'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    createModel
  },
  state: {
    cars: [],
    carsObjArray: [],
    model: {},
    trainedModel: {}
  },
  getters: {
    allCars: state => state.cars,
    allCarsObjArray: state => state.carsObjArray,
    theModel: state => state.model,
    trainedModel: state => state.trainedModel
  },
  actions: {
    async fetchCars ({ commit, state }) {
      const response = await axios.get('https://storage.googleapis.com/tfjs-tutorials/carsData.json')
      const filteredCars = response.data.map(car => ([
        car.Miles_per_Gallon,
        car.Horsepower
      ]))
        .filter(car => (car.mpg !== null && car.horsepower !== null))

      const filteredCarsObjArray = response.data.map(car => ({
        name: car.Name,
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower
      }))
        .filter(car => (car.mpg !== null && car.horsepower !== null))

      // const convertedToTensor = await convertToTensor(state)
      await commit('setCars', filteredCars)
      await commit('setCarsObjArray', filteredCarsObjArray)
      const model = createModel()
      const convertedToTensor = await convertToTensor(state.carsObjArray, model)
      const predictions = await testModel(model, state.carsObjArray, convertedToTensor)
    }
  },
  mutations: {
    setCars: (state, cars) => state.cars = cars,
    setCarsObjArray: (state, cars) => state.carsObjArray = cars,
    setTrainedModel: (state, trainedModel) => state.trainedModel = trainedModel
  }
})
