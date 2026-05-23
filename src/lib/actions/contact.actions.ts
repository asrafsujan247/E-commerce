import { z } from "zod";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactFormErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
}

interface ContactFormResult {
  success: boolean;
  message?: string;
  errors: ContactFormErrors | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function submitContactForm(data: ContactFormData): Promise<ContactFormResult> {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      error: null,
    };
  }

  return {
    success: true,
    message: "Your message has been sent successfully! We will contact you shortly.",
    errors: null,
    error: null,
  };
}
