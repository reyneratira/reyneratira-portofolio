import { useInView } from '../hooks'

interface SkillCategory {
  title: string
  colorClass: string
  skills: string[]
}

const categories: SkillCategory[] = [
  {
    title: 'Frontend',
    colorClass: 'text-primary-fixed',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
  },
  {
    title: 'Backend',
    colorClass: 'text-tertiary-fixed',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Express.js', 'Prisma'],
  },
  {
    title: 'Systems',
    colorClass: 'text-secondary-fixed',
    skills: ['Docker', 'Supabase', 'Railway', 'Render', 'Linux', 'CI/CD',],
  },
]

/**
 * Skills Section — "Technical Arsenal" bento grid with three skill cards.
 * Each card has a colored heading and chip-style tags.
 * Cards use hover:border-primary-container per DESIGN.md elevation rules.
 */
export default function Skills() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section
      id="skills"
      ref={ref as React.RefObject<HTMLElement>}
      className="flex flex-col gap-12 border-t border-surface-variant pt-16"
    >
      <h2
        className={`text-h2 text-on-surface transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        Technical Arsenal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <div
            key={cat.title}
            className={`bg-surface-container-low border border-surface-variant p-8 hover:border-primary-container transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: `${(i + 1) * 30}ms` }}
          >
            <h3 className={`text-h3 ${cat.colorClass} mb-6`}>{cat.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <li
                  key={skill}
                  className="bg-surface-variant text-on-surface text-label-caps px-3 py-1.5"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
