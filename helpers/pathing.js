import fs from 'fs'
import config from '../config.js'

function ensurePathExists( path ) {
    try {
        if ( !fs.existsSync(path) ) { fs.mkdirSync(path) }
    } catch (error) {
        console.log(error)
        return new Error(error.message)
    }
} 

export default ensurePathExists