import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRepository } from "../repositories/user.repository";
import type { User } from "@shared/schema";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
}).refine(data => data.name !== undefined || data.email !== undefined, {
  message: "At least one field must be provided",
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getProfile(userId: string): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Omit<User, "password">> {
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email already in use");
      }
    }

    const updated = await this.userRepository.update(userId, data);
    if (!updated) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async changePassword(userId: string, data: ChangePasswordData): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
