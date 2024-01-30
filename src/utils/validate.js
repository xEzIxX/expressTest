import { validationResult } from 'express-validator'

export const validate = validations => {
    return async (req, res, next) => {
        for (const validation of validations) {
            const result = await validation.run(req)
            if (result.errors.length) break
        }

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        res.status(400).json({
            message: '입력값이 올바르지 않습니다.',
            errors: errors.array(),
        })
    }
}
