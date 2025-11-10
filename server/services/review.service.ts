import { ReviewRepository } from "../repositories/review.repository";
import { type InsertReview } from "@shared/schema";

export class ReviewService {
  constructor(private reviewRepo: ReviewRepository) {}

  async createReview(userId: string, data: InsertReview) {
    // Check if user already reviewed this product
    const existingReview = await this.reviewRepo.findByUserAndProduct(userId, data.productId);
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    // Check if user has purchased this product
    const hasPurchased = await this.reviewRepo.userHasPurchasedProduct(userId, data.productId);
    if (!hasPurchased) {
      throw new Error("You can only review products you have purchased");
    }

    // Create the review
    return await this.reviewRepo.create({
      ...data,
      userId,
    });
  }

  async getProductReviews(productId: string) {
    const reviews = await this.reviewRepo.findByProductId(productId);
    const stats = await this.reviewRepo.getProductRatingStats(productId);
    
    return {
      reviews,
      stats,
    };
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.reviewRepo.findByUserAndProduct(userId, "");
    if (!review || review.id !== reviewId) {
      throw new Error("Review not found or unauthorized");
    }
    
    return await this.reviewRepo.delete(reviewId);
  }
}
