import {app} from './server'
import AuthController from '@services/auth.controller'

export function startService() {
    app.listen();
}

export async function generateToken() {
    const ac = new AuthController();
    return await ac.generateToken();
}