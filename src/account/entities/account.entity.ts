import { Column, Entity, PrimaryColumn } from "typeorm";
// import { AccountBuilder } from "./account.builder";

@Entity()
export class Account {
  @Column()
  name: string;

  @PrimaryColumn()
  document: string;

  @Column()
  availableLimit: number;

  // constructor(builder: AccountBuilder) {
  //   this.name = builder._name;
  //   this.document = builder._document;
  //   this.availableLimit = builder._availableLimit;
  // }
}
