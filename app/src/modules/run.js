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
      id: require(`${path}/package.json`).name,
      icon: `${path}/icon.png`,
      url: `${path}/app/index.html`
    }

    app.bookmarks.add(args.id, args.icon, args.url, 'app')
  }
}

module.exports = run