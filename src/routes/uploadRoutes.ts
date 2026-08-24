import { Router } from 'express'
import { getUploadTemplate } from '../services/uploadTemplateService'

const uploadRouter = Router()

uploadRouter.get('/template/:type', getUploadTemplate)

export default uploadRouter
