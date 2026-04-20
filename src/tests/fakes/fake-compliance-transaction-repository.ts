export class FakeComplianceRepository {
  records: any[] = [];

  async create(record: any, manager?: any) {
    this.records.push(record);
  }
}
