import { DataSource } from "typeorm";

export async function clearDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query(`DELETE FROM "compliance_transactions";`);
  await dataSource.query(`DELETE FROM "transactions";`);
  await dataSource.query(`DELETE FROM "wallets";`);
}
