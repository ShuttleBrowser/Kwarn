const { dialog } = require('electron').remote

const run = {
  choose () {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (path) => {
      if (path[0]) {
        this.add(path[0])
      }
    })
  },

  add (path) {
    path = path.replace(/\\/g,"/")

    let args = {
      id: require(`${path}/app.json`).name + `${Math.floor(Math.random() * (1000 - 1) + 1)}`,
      icon: `file://${path}/icon.png`,
      url: `file:///${path}/app/index.html`
    }

    app.bookmarks.add(args.id, args.icon, args.url, 'app')
  }
}

module.exports = run