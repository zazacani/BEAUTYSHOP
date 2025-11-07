import { DiscountRepository } from "../repositories/discount.repository";
import type { DiscountCode } from "@shared/schema";

export class DiscountService {
  private discountRepository: DiscountRepository;

  constructor(discountRepository: DiscountRepository) {
    this.discountRepository = discountRepository;
  }

  async validateCode(code: string, userId: string): Promise<DiscountCode> {
    const discount = await this.discountRepository.findByCode(code);
    
    if (!discount) {
      throw new Error("Invalid discount code");
    }

    if (discount.isSingleUse && discount.usedBy) {
      throw new Error("Discount code already used");
    }

    return discount;
  }

  async calculateDiscount(subtotal: number, discountCode: DiscountCode): Promise<number> {
    if (discountCode.type === "PERCENTAGE") {
      const percentage = parseFloat(discountCode.value);
      return (subtotal * percentage) / 100;
    } else {
      return Math.min(parseFloat(discountCode.value), subtotal);
    }
  }

  async markAsUsed(codeId: string, userId: string): Promise<void> {
    await this.discountRepository.markAsUsed(codeId, userId);
  }

  async getAllCodes(): Promise<DiscountCode[]> {
    return await this.discountRepository.findAll();
  }
}
