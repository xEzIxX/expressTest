import crypto from 'crypto'

export function getHash(password) {
    const hash = crypto.createHash('sha512') // 'sha512'알고리즘을 사용하여 hash obj 생성, 반환
    hash.update(password) // password를 암호화
    return hash.digest('base64') // 'base64' 인코딩 방식 사용
}