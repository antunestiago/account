import { Account } from "./account.entity";

export default class AccountBuilder {
  _document: string;
  _name: string;
  _availableLimit: number;

  constructor(document) {
    this._document = document;
  }

  get Name() {
    return this._name;
  }

  get Document() {
    return this._document;
  }

  get AvailableLimit() {
    return this._availableLimit;
  }

  setName(name: string): AccountBuilder {
    this._name = name;
    return this;
  }

  setAvailableLimit(limit: number): AccountBuilder {
    this._availableLimit = limit;
    return this;
  }

  build(): Account {
    const acc = new Account();
    acc.name = this.Name;
    acc.document = this.Document;
    acc.availableLimit = this.AvailableLimit;

    return acc;
  }


}