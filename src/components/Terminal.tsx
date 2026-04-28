import { useInView, useTypewriter } from '../hooks'

const terminalLines = [
  { prompt: true, text: 'cat whoami.txt' },
  {
    prompt: false,
    text: 'I am Reyner Atira Prasetyo, an aspiring software engineering student with an interest for robust architecture and brutalist UI. I am looking forward to buidling a website for a project, event, or company.',
  },
  { prompt: true, text: 'echo $LOCATION' },
  { prompt: false, text: 'Global Operations / Remote' },
]

/**
 * Terminal / About Section — "System ID" block with terminal-style UI.
 * Features a header bar with three window-control dots, monospace font,
 * and a blinking cursor. Uses typewriter hook for immersive effect.
 */
export default function Terminal() {
  const { ref, isInView } = useInView({ threshold: 0.2 })
  const { displayedText: cursor } = useTypewriter('_', 0, 0)

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className="flex flex-col gap-12 border-t border-surface-variant pt-16"
    >
      <h2
        className={`text-h2 text-on-surface transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
      >
        System ID
      </h2>

      <div
        className={`bg-surface-container-lowest border border-surface-variant overflow-hidden max-w-4xl transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        style={{ transitionDelay: '200ms' }}
        id="terminal-block"
      >
        {/* Terminal Header */}
        <div className="bg-surface-container-high px-4 py-2.5 flex items-center border-b border-surface-variant">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-surface-variant" />
            <div className="w-3 h-3 rounded-full bg-surface-variant" />
            <div className="w-3 h-3 rounded-full bg-surface-variant" />
          </div>
          <span className="ml-4 text-outline-variant text-sm font-mono">
            guest@reyner-sys: ~
          </span>
        </div>

        {/* Terminal Content */}
        <div className="p-8 font-mono text-on-surface-variant space-y-4 text-[15px] leading-relaxed">
          {terminalLines.map((line, i) => (
            <p key={i} className={line.prompt ? '' : 'text-on-surface'}>
              {line.prompt && (
                <span className="text-primary-fixed">~ &gt; </span>
              )}
              {line.text}
            </p>
          ))}
          <p>
            <span className="text-primary-fixed">~ &gt; </span>
            <span className="animate-blink">{cursor || '_'}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
