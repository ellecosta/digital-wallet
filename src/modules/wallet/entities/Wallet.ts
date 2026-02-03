import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  cpf!: string;

  @Column()
  name!: string;

  @Column()
  password!: string; // hash of the password

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
