import { db } from '../models/index.js'

export async function isPasswordValid(userId, password) {
    const user = await db.User.findOne({
        where: { user_id: userId },
    })

    if (user.user_password === password) return true
    else return false
}
