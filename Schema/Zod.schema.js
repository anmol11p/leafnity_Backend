import { z } from "zod";

const signUpSchema = z.object({
  name: z.coerce
    .string({ required_error: "Name is required" }) // Required message added
    .max(255, { message: "Name cannot be more than 255 characters" })
    .min(2, { message: "Name should be minimum of 2 characters" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name should only contain letters and spaces",
    })
    .trim(),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .trim(), // Email validation

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }) // Minimum password length
    .max(100, { message: "Password cannot be more than 100 characters" })
    .trim(), // Maximum password length
});

const LoginSchema = signUpSchema.pick({ email: true, password: true });
const updateSchema = signUpSchema.pick({ email: true, name: true });
const changePasswordSchema = z
  .object({
    password: z
      .string({ required_error: "password is required" })
      .min(6, { message: "Password should be at least 6 characters" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, { message: "New password should be at least 6 characters" })
      .max(255, {
        message: "New password should not be more than 255 characters",
      }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.newPassword !== data.password, {
    path: ["password"],
    message: "password and new password doest same",
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password must match new password",
  });

const OrderSchema = z.object({
  addressId: z
    .string({ required_error: "address id is required" })
    .min(1, { message: "address id should be min of 1 chars" }),
  totalAmount: z.number({ required_error: "total amount is required" }),
  items: z.array(
    z.object({
      plantId: z.string({ required_error: "plantId is required" }),
      quantity: z.number({ required_error: "quantity is required" }),
      totalAmount: z.number({ required_error: "quantity is required" }),
    })
  ),
  razorpayOrderId: z
    .string({ required_error: "razorpay order id is required" })
    .min(2, { message: "razorpay order id minimum should be 2 characters" }),
});

const AddressSchema = z.object({
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(20, { message: "Phone number must not exceed 20 characters" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" })
    .trim(),

  street: z
    .string({ required_error: "Street is required" })
    .min(2, { message: "Street must be at least 2 characters" })
    .trim(),

  city: z
    .string({ required_error: "City is required" })
    .min(2, { message: "City must be at least 2 characters" })
    .trim(),

  state: z
    .string({ required_error: "State is required" })
    .min(2, { message: "State must be at least 2 characters" })
    .trim(),

  postalCode: z
    .string({ required_error: "Postal Code is required" })
    .regex(/^\d{5,10}$/, {
      message: "Postal Code must be between 5-10 digits",
    })
    .trim(),

  country: z
    .string({ required_error: "Country is required" })
    .min(2, { message: "Country must be at least 2 characters" })
    .trim(),
  fullName: z
    .string({ required_error: "full name is required" })
    .max(255, { message: "full name is not more than 255 characters" })
    .trim()
    .min(2, { message: "name should be minimum of 2 characters" }),
});

const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .trim()
    .email({ message: "Invalid email format" }),
});

export {
  AddressSchema,
  OrderSchema,
  ForgotPasswordSchema,
  changePasswordSchema,
  LoginSchema,
  updateSchema,
  signUpSchema,
};
