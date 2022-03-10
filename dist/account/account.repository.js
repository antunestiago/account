"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRepositoryImpl = void 0;
const account_entity_1 = require("./entities/account.entity");
class AccountRepositoryImpl {
    constructor() {
        this.accounts = [];
    }
    create(createAccountDto) {
        const account = new account_entity_1.Account();
        account.name = createAccountDto.name;
        account.document = createAccountDto.document;
        account.availableLimit = createAccountDto.availableLimit;
        this.accounts.push(account);
        console.log('Accounts after new  creation: ', this.accounts);
        return new Promise((resolve) => resolve(account));
    }
    findAccountByDocument(document) {
        return this.accounts.find((account) => account.document === document);
    }
}
exports.AccountRepositoryImpl = AccountRepositoryImpl;
//# sourceMappingURL=account.repository.js.map