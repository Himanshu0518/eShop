import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "support@eshop.com",
      link: "mailto:support@eshop.com",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "123 Fashion Street, NY 10001",
      link: "#",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon - Fri: 9AM - 6PM EST",
      link: "#",
    },
  ];

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Get in Touch
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs tracking-wider uppercase text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs tracking-wider uppercase text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Message
                </Label>
                <textarea
                  id="message"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 rounded-none border border-border bg-transparent focus:border-foreground focus:outline-none transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-none px-8 h-11 text-xs tracking-widest uppercase font-medium"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:pl-8">
            <div className="space-y-8">
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.link}
                  className="flex items-start gap-4 group"
                >
                  <div className="p-3 bg-muted rounded-none">
                    <info.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xs tracking-wider uppercase text-muted-foreground mb-1">
                      {info.title}
                    </h3>
                    <p className="text-foreground group-hover:underline underline-offset-4">
                      {info.content}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
