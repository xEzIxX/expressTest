export class Auth {
    login() {
        res.render('./views/loginPage')
    }

    checkLog() {
        // 입력한 정보가 올바른지 체크
    }

    main() {
        res.render('./views/main')
    }

    signUp() {
        res.render('./views/signup')
    }

    signUpHandler() {
        // 회원정보 저장
    }
}
