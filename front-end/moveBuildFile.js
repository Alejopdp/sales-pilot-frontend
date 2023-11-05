const fs = require('fs')
const path = require('path')

const buildFolder = path.join(__dirname, 'build', 'static', 'js')
const mediaSourceFolder = path.join(__dirname, 'build', 'static', 'media')
const targetFolder = path.join(__dirname, '..', 'react', 'js')

if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true })
}

function removeOldMainFile() {
    fs.readdir(targetFolder, (err, files) => {
        if (err) {
            console.error(err)
            return
        }

        files.forEach((file) => {
            if (file.match(/^main\.[a-z0-9]+\.js$/)) {
                const filePath = path.join(targetFolder, file)
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    console.log(`Removed old ${file}`)
                })
            }
        })
    })
}

removeOldMainFile()

fs.readdir(buildFolder, (err, files) => {
    if (err) {
        console.error(err)
        return
    }

    files.forEach((file) => {
        if (file.match(/^main\.[a-z0-9]+\.js$/)) {
            const sourcePath = path.join(buildFolder, file)
            const targetPath = path.join(targetFolder, 'main.js')

            fs.rename(sourcePath, targetPath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }

                console.log(`Moved ${file} to ${targetFolder} as main.js`)
            })
        }
    })
})
