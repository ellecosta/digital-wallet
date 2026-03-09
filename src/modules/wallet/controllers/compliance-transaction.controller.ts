import { Request, Response } from "express";
import { IComplianceTransactionService } from "../services/compliance-transaction.service.interface";

export class ComplianceTransactionController {
    constructor(
        private complianceTransactionService: IComplianceTransactionService
    ) {}

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const compliances = await this.complianceTransactionService.getAll();
            return res.status(200).json(compliances);
        } catch (error: any) {
            return res.status(500).json({
                message: "Error fetching compliance transactions",
                error: error.message,
            });
        }
    }
}