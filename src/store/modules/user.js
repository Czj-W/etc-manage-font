import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, MESH_NO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    meshNo: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MESH_NO: (state, meshNo) => {
      state.meshNo = meshNo
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            // console.log(response.meta.resultCode)
            if (response.meta.resultCode === 0) {
              Vue.ls.set(ACCESS_TOKEN, response.data.authToken, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', response.data.authToken)
              console.log('set token success')
              resolve()
            } else {
              reject(response.meta.result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    SwitchMeshNo({ commit }, meshNo) {
      console.warn(`store mesh no ${meshNo} as default`)
      Vue.ls.set(MESH_NO, meshNo)
      commit('SET_MESH_NO', meshNo)
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const result = response.data
            console.log('user.js#getInfo', result)
            if (result.role && result.role.permissions.length > 0) {
              const role = result.role
              role.permissions = result.role.permissions
              role.permissions.map(per => {
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map(action => {
                    return action.action
                  })
                  per.actionList = action
                }
              })
              role.permissionList = role.permissions.map(permission => {
                return permission.permissionId
              })
              console.log(result.role)
              commit('SET_ROLES', result.role)
              commit('SET_INFO', result)
              if (Vue.ls.get(MESH_NO) == null) {
                console.warn(`Mesh no is null, store ${result.meshes[0].meshNo} as default`)
                Vue.ls.set(MESH_NO, result.meshes[0].meshNo)
                commit('SET_MESH_NO', result.meshes[0].meshNo)
              }
              console.log(`Mesh no is ${Vue.ls.get(MESH_NO)}`)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }

            commit('SET_NAME', { name: result.name, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)

            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        logout(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
          .finally(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            Vue.ls.remove(ACCESS_TOKEN)
          })
      })
    }
  }
}

export default user
