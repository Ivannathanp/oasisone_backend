import fs from 'fs'
import config from '../../config.js'

async function uploadcontract(req, res) {
    try {
		return res.status(200).json({
            status: 'SUCCESS', 
            message: 'Upload successful'
        })
	} catch (error) {
		console.log(error)
		return res.status(500).json({
            status: 'ERROR', 
            message: error.message
        })
	}
}

async function getcontract(req, res) {
    try {
        const { tenantId } = req.params;
        const imageDirPath = config.CONTRACT + tenantId
        const images = fs.readdirSync(imageDirPath);
        
        const imagePath = config.CONTRACT + tenantId + `/${images[0]}`
        const image = fs.readFileSync(imagePath);
        
        res.writeHead(200, {'Content-Type': "application/pdf"})
        res.write(image)
        return res.end()

    } catch (error) {
        return res.status(500).json({
            status: 'ERROR', 
            message: error.message
        })
    }
}

export { uploadcontract, getcontract }