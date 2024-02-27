export function wrapper(asyncFn) {
    return async (req, res, next) => {
        try {
            return await asyncFn(req, res, next)
            // 에러가 발생하면 .catch()의 next()를 통해 에러 핸들러로 이동
            // (next()에 매개변수로 어떠한 것도 넘겨주지 않으면 현재 요청을 오류로 간주)
        } catch (error) {
            return next(error)
        }
    }
}
