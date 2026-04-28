import { useState } from 'react'
import { useInView } from '../hooks'

/**
 * Contact Section — "Initiate Protocol" with contact form and direct lines.
 * Input fields use 1px solid borders, focus:primary-container per DESIGN.md.
 * Transmit button is primary-container solid.
 */
export default function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic placeholder
    console.log('Form submitted:', formData)
  }

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="flex flex-col gap-12 border-t border-surface-variant pt-16"
    >
      <h2
        className={`text-h2 text-on-surface transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        Initiate Protocol
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Form */}
        <div
          className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-body-lg text-on-surface-variant mb-8">
            Ready to build something substantial? Drop a message to start the
            conversation.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6" id="contact-form">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className="text-label-caps text-on-surface">
                Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ENTER NAME"
                className="bg-surface-container border border-surface-variant p-4 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary-container focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className="text-label-caps text-on-surface">
                Email
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ENTER EMAIL"
                className="bg-surface-container border border-surface-variant p-4 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary-container focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="text-label-caps text-on-surface">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="ENTER MESSAGE"
                rows={4}
                className="bg-surface-container border border-surface-variant p-4 text-body-md text-on-surface placeholder:text-outline-variant focus:border-primary-container focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary-container text-on-primary-container text-label-caps px-8 py-4 border-none hover:bg-primary-fixed transition-colors duration-200 self-start mt-4 cursor-pointer"
              id="contact-submit"
            >
              Transmit
            </button>
          </form>
        </div>

        {/* Direct Lines */}
        <div
          className={`flex flex-col gap-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div>
            <h3 className="text-h3 text-on-surface mb-4">Direct Lines</h3>
            <a
              href="mailto:reyneratiraprasetyo@gmail.com"
              className="text-body-md text-on-surface-variant hover:text-primary-fixed transition-colors"
              id="email-link"
            >
              reyneratiraprasetyo@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
