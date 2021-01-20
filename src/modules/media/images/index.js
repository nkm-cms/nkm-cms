const context = require.context('./', false, /\.png$/)
const images = {}
context.keys().forEach(image => {
  const { name } = /(?<name>\w+)_54/.exec(image).groups
  images[name.toLocaleLowerCase()] = context(image)
})
export default images
