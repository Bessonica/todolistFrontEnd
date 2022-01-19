module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": ["eslint:recommended", "prettier", "plugin:sonarjs/recommended"],
    "parserOptions": {
        "ecmaVersion": 13,
        "sourceType": "module"
    },
    "plugins": [
        "prettier", "sonarjs"
    ],
    "rules": {
        "prettier/prettier": "error"
    }
};
