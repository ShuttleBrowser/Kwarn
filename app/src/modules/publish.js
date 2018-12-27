const zip = require('zip-a-folder')
const { dialog } = require('electron').remote

const publish = {
  modale (show) {
    const publishAppModal = document.querySelector('#publish-app')

    if (show) {
      publishAppModal.style.display = 'block'
      document.querySelector('#publishApp-appName-toShow').innerHTML = ''
    } else {
      publishAppModal.style.display = 'none'
    }
  },

  select () {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (path) => {
      if (path[0] !== undefined) {
        document.querySelector('#publishApp-appName-toShow').innerHTML = require(`${path[0]}/package.json`).name
      }
    })
  },

  compress (path) {
    return new Promise((resolve, reject) => {
      zip.zipFolder(`${path}/app`, `${path}/app.zip`, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },

  send () {
    app.settings.get('token').then((USER_TOKEN) => {

    })
  }
}

module.exports = publish