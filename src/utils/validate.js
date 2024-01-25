import { validationResult } from 'express-validator'

export const validate = validations => {
    return async (req, res, err, next) => {
        for (const validation of validations) {
            const result = await validation.run(req)
            if (result.errors.length) break
        }

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        } else {
            throw new Error(err)
        }
    }
}
