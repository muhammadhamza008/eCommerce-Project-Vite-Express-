import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { name: "VitaBoost Rx", href: "#" },
      { name: "Energy Pack", href: "#" },
      { name: "Sleep Support", href: "#" },
      { name: "Immunity Bundle", href: "#" },
    ],
    support: [
      { name: "Contact Us", href: "#" },
      { name: "FAQs", href: "#faq" },
      { name: "Shipping", href: "#" },
      { name: "Returns", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Science", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="mb-4 inline-block">
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Vita<span className="text-accent-green">Boost</span>
              </span>
            </a>
            <p className="mb-6 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
              Premium supplements backed by science. Our mission is to help you achieve optimal health with natural, effective solutions.
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:hello@vitaboost.com" className="flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Mail className="h-4 w-4" />
                hello@vitaboost.com
              </a>
              <span className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                San Francisco, CA
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Products
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="font-body text-sm text-muted-foreground">
            © {currentYear} VitaBoost. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
