const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  meshes: state => state.user.info.meshes,
  meshNo: state => state.user.meshNo,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,
  currentMesh: state => state.user.info.meshes.find(mesh => mesh.meshNo === state.user.meshNo),
  category: state => state.oms.category,
  brandList: state => state.oms.brandList
}

export default getters
