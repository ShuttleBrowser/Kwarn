const fs = require('fs')
const { dialog, shell } = require('electron').remote
const run = require('./run.js')

const create = {
  modale (show) {
    const createAppModal = document.querySelector('#create-app')

    document.querySelector('#createapp-appName').value = ''
    document.querySelector('#createapp-appVersion').value = ''
    document.querySelector('#createSelectApp').innerHTML = 'Where do you want to create your app ?'

    if (show) {
      createAppModal.style.display = 'block'
    } else {
      createAppModal.style.display = 'none'
    }
  },

  select () {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (path) => {
      document.querySelector('#createSelectApp').innerHTML = path[0]
    })
  },

  generate: () => {
    const name = document.querySelector('#createapp-appName').value
    const version = document.querySelector('#createapp-appVersion').value
    const appPath =document.querySelector('#createSelectApp').innerHTML

    if (name !== '' && version !== '') {
        const defaultIcon = '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'
        const defaultBanner = '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'
        const defaultHtml = `<html>\n<head>\n<meta charset="UTF-8">\n<title>${name}</title>\n</head>\n<body>\n<!-- YOUR HTML CODE HERE -->\n<h4>Say welcome to ${name} !</h4>\n</body>\n<script>\n/*\nJAVSCRIPT HERE,\nYou can use NodeJS modules\nRead the documentation: https://doc.shuttleapp.io\n*/\n</script>\n</html>`
        const jsonFileTemplace = {
          name: name,
          version: version
        }
  
        if (appPath !== undefined) {
  
          fs.mkdir(`${appPath}/${name}`, (err) => {
            if (err) {
              alert(err)
            } else {
              fs.writeFileSync(`${appPath}/${name}/icon.png`, defaultIcon, 'base64')
              fs.writeFileSync(`${appPath}/${name}/banner.png`, defaultBanner, 'base64')
              fs.writeFileSync(`${appPath}/${name}/app.json`, JSON.stringify(jsonFileTemplace))
              fs.mkdir(`${appPath}/${name}/app`, (err) => {
                if (err) {
                  alert(err)
                } else {
                  fs.writeFileSync(`${appPath}/${name}/app/index.html`, defaultHtml)
                  shell.openExternal(`${appPath}/${name}`)
                  run.add(`${appPath}/${name}`)
                  this.modale(false)
                }
              })
            }
          })
    
        }

    }
  
  }

}

module.exports = create