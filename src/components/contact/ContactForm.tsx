import { useState } from "react";
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { submitContactForm } from "@lib/actions/contact.actions";

interface ContactFormProps {
  formTitle?: string;
  formDescription?: string;
}

const ContactForm = ({ formTitle, formDescription }: ContactFormProps) => {
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const formData = {
        name: (fd.get("name") as string) ?? "",
        email: (fd.get("email") as string) ?? "",
        subject: (fd.get("subject") as string) ?? "",
        message: (fd.get("message") as string) ?? "",
      };
      const result = await submitContactForm(formData);
      setStatus(result as { success?: boolean; message?: string });
      if ((result as { success?: boolean }).success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setStatus({ success: false, message: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6 lg:p-8">
      {formTitle && <h2 className="text-xl font-semibold text-foreground mb-2">{formTitle}</h2>}
      {formDescription && <p className="text-muted-foreground text-sm mb-6">{formDescription}</p>}

      {status && (
        <div className={`flex items-center gap-2 p-3 rounded-lg mb-6 text-sm ${status.success ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-red-50 text-red-700 dark:bg-red-900/20"}`}>
          {status.success ? <FiCheckCircle /> : <FiAlertCircle />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input name="name" required placeholder="Your name" className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input type="email" name="email" required placeholder="your@email.com" className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
          <div className="relative">
            <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input name="subject" placeholder="How can we help?" className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Message</label>
          <textarea name="message" required rows={5} placeholder="Tell us more..." className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-70"
        >
          <FiSend className="w-4 h-4" />
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
