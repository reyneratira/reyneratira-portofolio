import { useState } from 'react'

/**
 * TopNavBar — Minimalist fixed navigation with heavy bottom border.
 * Links use strikethrough hover effect in primary color per DESIGN.md.
 */
export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Skills', href: '#skills' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileOpen(false)
  }

  return (
    <nav
      id="main-nav"
      className="fixed top-0 left-0 w-full z-50 border-b-2 border-surface-container-highest bg-surface-container-lowest/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-5 max-w-[1280px] mx-auto">
        {/* Logo */}
        <a
          href="#"
          className="font-display text-2xl font-black text-on-surface tracking-tighter"
          id="nav-logo"
        >
          REYNER ATIRA
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-label-caps text-on-surface-variant transition-all duration-200 hover:decoration-primary-container hover:text-on-surface cursor-pointer"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-label-caps text-primary-container border-b-2 border-primary-container pb-1 transition-all duration-200 hover:text-primary cursor-pointer"
              id="nav-hire-me"
            >
              Hire Me
            </a>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-on-surface p-2 cursor-pointer"
          id="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span
              className={`h-0.5 bg-on-surface transition-all duration-300 ${isMobileOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            />
            <span
              className={`h-0.5 bg-on-surface transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''
                }`}
            />
            <span
              className={`h-0.5 bg-on-surface transition-all duration-300 ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-surface-container-highest bg-surface-container-lowest overflow-hidden transition-all duration-300 ${isMobileOpen ? 'max-h-80' : 'max-h-0'
          }`}
        id="mobile-menu"
      >
        <ul className="flex flex-col px-8 py-6 gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-label-caps text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-label-caps text-primary-container"
            >
              Hire Me
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
