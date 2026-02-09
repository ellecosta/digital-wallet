import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum ComplianceOperationType {
  LARGE_TRANSFER = 'LARGE_TRANSFER',
  LARGE_DEPOSIT = 'LARGE_DEPOSIT',
  MULTIPLE_WITHDRAWALS = 'MULTIPLE_WITHDRAWALS',
}

@Entity('compliance_transactions')
export class ComplianceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: ComplianceOperationType,
  })
  operationType!: ComplianceOperationType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount!: number;

  @ManyToOne(() => Wallet)
  sourceWallet!: Wallet;

  @ManyToOne(() => Wallet, { nullable: true })
  targetWallet?: Wallet;

  @CreateDateColumn()
  createdAt!: Date;
}
