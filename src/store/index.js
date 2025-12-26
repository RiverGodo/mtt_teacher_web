import Vue from 'vue'
import Vuex from 'vuex'
import middlewares from './middlewares'
import auth from './modules/auth'
import product from './modules/product'

import main from './main'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  ...main,
  modules: {
    auth, product,
  },
  plugins: middlewares,
  strict: debug,
})
