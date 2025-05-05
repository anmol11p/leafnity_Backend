import { Resend } from "resend";
import EmailTemplate from "../template/email.template.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPassword(email, link) {
  try {
    // Generate the email body using the EmailTemplate function
    const emailBody = EmailTemplate(link);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "forgot password link",
      html: emailBody,
    });

    // Check for errors in the response from Resend
    if (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        message: "Failed to send email",
        error,
      };
    }

    // console.log("Email sent successfully:", data);
    return {
      success: true,
      message: "Email sent successfully",
      data,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while sending the email",
      error: error.message,
    };
  }
}
