export function wrapper(asyncFn) {
    return async (req, res, next) => {
        try {
            return await asyncFn(req, res, next)
        } catch (err) {
            return next(err)
            // 예외 발생 시 next(err)를 통해 에러 핸들러로 이동
        }
    }
}
