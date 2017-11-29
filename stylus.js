const fs = require('fs')
const path = require('path')
const stylus = require('stylus')
const nib = require('nib')

const args = process.argv

let inputPath = path.join(__dirname, 'themes/stylus/')
let outputPath = path.join(__dirname, 'themes/')

const inputArgIndex = args.indexOf('-i')
if (inputArgIndex > 1) {
  const argValue = args[inputArgIndex + 1]
  if (argValue) {
    inputPath = path.join(__dirname, argValue)
  }
}
const outputArgIndex = args.indexOf('-o')
if (outputArgIndex > 1) {
  const argValue = args[outputArgIndex + 1]
  if (argValue) {
    outputPath = path.join(__dirname, argValue)
  }
}

const getFiles = Promise.resolve({
  then: (resolve, reject) => {
    fs.readdir(inputPath, (err, files) => {
      if (err) {
        reject(err)
      }
      resolve(files)
    })
  }
}).catch(err => {
  console.error(err)
})

function readFileTask (filePath) {
  return Promise.resolve({
    then: (resolve, reject) => {
      fs.readFile(path.join(inputPath, filePath), 'utf8', (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    }
  })
}

function readFileTasks (files) {
  const tasks = []
  files.forEach((file) => {
    tasks.push(readFileTask(file))
  })
  return Promise.all(tasks).then((results) => {
    return results.map((result, index) => {
      return {
        fileName: files[index],
        source: result
      }
    })
  })
}

function renderStylus (fileName, source) {
  fileName = fileName.replace('.styl', '.css')
  return Promise.resolve({
    then: (resolve, reject) => {
      stylus(source)
        .set('filename', fileName)
        .set('compress', true)
        .use(nib())
        .import('nib')
        .render((err, css) => {
          if (err) reject(err)
          resolve({
            fileName,
            source: css
          })
        })
    }
  })
}

function renderMultiStylus (results) {
  const tasks = []
  results.forEach((result) => {
    tasks.push(renderStylus(result.fileName, result.source))
  })
  return Promise.all(tasks)
}

function writeFile (fileName, source) {
  return Promise.resolve({
    then: (resolve, reject) => {
      fs.writeFile(fileName, source, 'utf8', (err) => {
        if (err) reject(err)
        resolve(fileName)
      })
    }
  })
}

function writeMutiFile (files) {
  const tasks = []
  files.forEach((file) => {
    const filePath = path.join(outputPath, file.fileName)
    tasks.push(writeFile(filePath, file.source))
  })
  return Promise.all(tasks)
}

getFiles.then(files => {
  return readFileTasks(files)
}).then(results => {
  return renderMultiStylus(results)
}).then(results => {
  return writeMutiFile(results)
}).then((results) => {
  console.log('stylus files have compiled!')
  results.forEach((fileName, index) => {
    console.log(`[${index}]: ${fileName}`)
  })
  return results
}).catch(err => {
  console.error(err)
})
