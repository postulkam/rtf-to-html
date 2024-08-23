const rtfToHTML = require('@iarna/rtf-to-html')
const fs = require('fs')

// delete files from 'html-converted' folder
fs.readdirSync('html-converted').forEach((file) => {
  fs.unlinkSync(`html-converted/${file}`)
})

// delete files from 'mid-rtf-converted' folder
fs.readdirSync('mid-rtf-converted').forEach((file) => {
  fs.unlinkSync(`mid-rtf-converted/${file}`)
})

try {
  // loop through all files
  fs.readdirSync('rtf-to-convert')
    .forEach((file) => {
      // open the file and change 'f1' string to 'f0' in whole file
      let data = fs.readFileSync(`rtf-to-convert/${file}`, 'utf8')

      // find if there is charset238 Calibri; and remove it
      if (data.includes('charset238')) {
        data = data.replace(/f1/g, 'f0')
        data = data.replace(/{\f0\fnil\fcharset238 Calibri;}/g, '')
      }

      fs.writeFileSync(`mid-rtf-converted/${file}`, data)

      // convert rtf to html
      fs.createReadStream(`mid-rtf-converted/${file}`)
        .pipe(rtfToHTML((err, html) => {
          // save the html code to html file to the html-converted folder
          const fileName = file.replace('.rtf', '.html')
          fs.writeFileSync(`html-converted/${fileName}`, html)

          console.log(`...file ${fileName} converted`)
        }))
    })
} catch (err) {
  console.log('Conversion failed!')
  console.error(err)
}
