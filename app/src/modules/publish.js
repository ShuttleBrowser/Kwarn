const request = require('request')
const zip = require('zip-a-folder')
const fs = require('fs')
const { dialog } = require('electron').remote

const publish = {
  modale (show) {
    const publishAppModal = document.querySelector('#publish-app')

    if (show) {
      publishAppModal.style.display = 'block'
      document.querySelector('#publishSelectApp').innerHTML = 'Select your application'
    } else {
      publishAppModal.style.display = 'none'
    }
  },

  select () {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (path) => {
      if (path[0] !== undefined) {
        let appName = require(`${path[0]}/app.json`).name
        document.querySelector('#publishSelectApp').innerHTML = `${appName}: <span id="publishFilePath">${path[0]}</span>`
      }
    })
  },

  compress () {
    return new Promise((resolve, reject) => {
      const path = document.querySelector('#publishFilePath').innerHTML.replace(/\\/g,"/")

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
    const path = document.querySelector('#publishFilePath').innerHTML.replace(/\\/g,"/")
    const json = require(`${path}/app.json`)

    app.settings.get('token').then((USER_TOKEN) => {

      if (USER_TOKEN === '') {
        alert('You need to be connected for publish app')
      } else {

        publish.compress().then(() => {
          const form = {
            token: USER_TOKEN,
            name: json.name,
            description: json.description,
            keywords: document.querySelector('#publishApp-appKeywords').value,
            version: document.querySelector('#publishApp-appVersion').value,
            type: 'app',
            categorie: 'none',
            git: json.git,
            paypal: 'false',

            bannerFile: {
              value: fs.createReadStream(`${path}/banner.png`),
              options: {
                filename: 'banner.png',
                contentType: 'image/png'
              }
            },

            iconFile: {
              value: fs.createReadStream(`${path}/icon.png`),
              options: {
                filename: 'icon.png',
                contentType: 'image/png'
              }
            },

            appFile: {
              value: fs.createReadStream(`${path}/app.zip`),
              options: {
                filename: 'app.zip',
                contentType: 'application/zip'
              }
            }
          }

          console.log(form)

          request.post({
            url: 'https://api.shuttleapp.io/store/action/upload',
            formData: form
          }, (err, httpResponse, body) => {
            console.log(httpResponse)
            if (err) {
              console.log(err)
            } else {
              console.log(body)
            }
          })

        })

      }
    })
  }
}

module.exports = publish