import { Link, NavLink } from "react-router-dom";
import { MessageSquare, Twitter, Linkedin, PlusCircle } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { href: "https://twitter.com/LangBridgeapp", label: "Twitter", icon: <Twitter className="size-6" /> },
    { href: "https://linkedin.com/company/LangBridgeapp", label: "LinkedIn", icon: <Linkedin className="size-6" /> },
    { href: "https://pluscircle.com/LangBridge", label: "PlusCircle", icon: <PlusCircle className="size-6" /> },
  ];

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">LangBridge</h2>
            </div>
            <p className="text-base-content opacity-70">
              Chat with flair, anytime, anywhere.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Explore</h3>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
                  }
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chatting"
                  className={({ isActive }) =>
                    `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
                  }
                >
                  Chat
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
                  }
                >
                  Support
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    `hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
                  }
                >
                  Privacy
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <address className="not-italic space-y-2">
              <p>Email: <a href="mailto:hello@LangBridge.app" className="hover:text-primary">hello@LangBridge.app</a></p>
              <p>Phone: <a href="tel:+15551234567" className="hover:text-primary">+1 555 123 4567</a></p>
            </address>
            <div className="flex gap-4 mt-4">
              {socialLinks.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  className="hover:text-primary transition-colors"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-base-content/20 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-sm text-base-content opacity-70">
            © 2025 LangBridge. All rights reserved.
          </p>
          <div className="flex gap-4">
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                `text-sm hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
              }
            >
              Terms
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `text-sm hover:text-primary transition-colors ${isActive ? "text-primary" : ""}`
              }
            >
              Privacy
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;