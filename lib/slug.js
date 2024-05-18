const slug = require('slug')

const generateSlug = (texts) => { 
    
    const text = texts;
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const urlSlug = slug(`${text}-${randomNumber}`);
    
    return urlSlug;

}

module.exports = generateSlug