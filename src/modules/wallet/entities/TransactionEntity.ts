import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Wallet } from './Wallet';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount!: number;

  @ManyToOne(() => Wallet)
  fromWallet!: Wallet;

  @ManyToOne(() => Wallet, { nullable: true })
  toWallet?: Wallet;

  @CreateDateColumn()
  createdAt!: Date;
}
