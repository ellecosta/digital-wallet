export class FakeComplianceRepository {
  records: any[] = [];

  async create(record: any) {
    this.records.push(record);
  }
}
