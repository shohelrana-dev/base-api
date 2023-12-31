//dependencies
import 'reflect-metadata'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'
import { createServer } from 'http'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from 'node-http-exceptions'
import { notFoundMiddleware } from 'node-http-exceptions'
import { InversifyExpressServer } from 'inversify-express-utils'

//dotenv initialize
dotenv.config()

//internal import
import deserializeUserMiddleware from '@middleware/deserialize-user.middleware'
import { container } from '@/config/inversify.config'

const server = new InversifyExpressServer(container, undefined, {
    rootPath: '/api/v1',
})

server
    .setConfig(app => {
        //apply initial configurations
        app.use(morgan('dev'))
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))
        app.use(
            cors({
                credentials: true,
                origin: true,
                optionsSuccessStatus: 200,
            })
        )
        app.use(cookieParser())

        //static path
        app.use(express.static(path.resolve(__dirname, '../../public')))

        //deserialize current user
        app.use(deserializeUserMiddleware)
    })
    .setErrorConfig(app => {
        // handle error
        app.use(notFoundMiddleware)
        app.use(errorMiddleware)
    })

//build app
const app = server.build()

//create a http server instance
const httpServer = createServer(app)

//export the http server
export { httpServer }
