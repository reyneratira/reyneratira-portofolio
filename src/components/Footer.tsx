/**
 * Footer — Minimal bottom bar with branding, copyright, and social links.
 * Heavy top border and uppercase text matching the navigation style.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { label: 'Github', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Source Code', href: '#' },
  ]

  return (
    <footer
      id="footer"
      className="bg-surface-container-lowest border-t-2 border-surface-container-highest w-full py-12 px-6 md:px-16 mt-auto"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8 font-display text-xs uppercase tracking-tight">
        {/* Brand */}
        <div className="text-lg font-bold text-on-surface">REYNER ATIRA</div>

        {/* Copyright */}
        <p className="text-outline">
          © {currentYear} REYNER ATIRA PRASETYO. BUILT FOR PRECISION.
        </p>

        {/* Social Links */}
        <div className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-outline hover:text-primary-container hover:underline transition-colors duration-200"
              id={`footer-${link.label.toLowerCase().replace(' ', '-')}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
