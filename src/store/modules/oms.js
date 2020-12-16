// import Vue from 'vue'

const oms = {
  state: {
    category: '',
    brandList: ''
  },

  mutations: {
    SET_category: (state, category) => {
      state.category = category
    },
    SET_brandList: (state, brandList) => {
      state.brandList = brandList
    }
  },

  actions: {
    setCategory({ commit }, data) {
      commit('SET_category', data)
    },
    setBrand({ commit }, data) {
      commit('SET_brandList', data)
    }
  }
}

export default oms
