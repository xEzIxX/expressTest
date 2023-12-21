module.exports = {
    "root":true,
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js}"
            ],
            "rules": {
                "no-unused-expressions": "off"
              },
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "prettier"
    ],
    "rules": {
        "eqeqeq": "warn",
        "strict": "off"
    }
}
