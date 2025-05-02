function EmailTemplate(link) {
  return `
    <div style="font-family: sans-serif; background: #f3f4f6; padding: 2rem; text-align: center;">
      <div style="max-width: 400px; margin: auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #111827;">Reset Your Password</h2>
        <p style="color: #6b7280;">Click the button below to reset your password:</p>
        <a href="${link}" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p style="color: #9ca3af; margin-top: 1rem; font-size: 0.875rem;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
}

export default EmailTemplate;
