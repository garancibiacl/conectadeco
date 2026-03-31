import { useRef, useState } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function HeroPhoneMockup({ imageSrc, imageAlt, scrollProgress = 0 }) {
  const frameRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovering: false })

  const handlePointerMove = (event) => {
    const frame = frameRef.current
    if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const bounds = frame.getBoundingClientRect()
    const pointerX = (event.clientX - bounds.left) / bounds.width
    const pointerY = (event.clientY - bounds.top) / bounds.height

    const rotateY = 8 + (pointerX - 0.5) * 3.2
    const rotateX = (0.5 - pointerY) * 5.5

    setTilt({
      rotateX: clamp(rotateX, -4.5, 4.5),
      rotateY: clamp(rotateY, 6.8, 9.6),
      isHovering: true,
    })
  }

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovering: false })
  }

  const handlePointerEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setTilt({ rotateX: 0, rotateY: 8, isHovering: true })
  }

  return (
    <div className="hero-phone-scene relative mx-auto w-full max-w-[460px] [perspective:1600px]">
      <div
        ref={frameRef}
        className="hero-phone-float hero-phone-shell group relative"
        style={{
          '--phone-scroll-translate': `${scrollProgress * 18}px`,
          '--phone-rotate-x': `${tilt.rotateX}deg`,
          '--phone-rotate-y': `${tilt.rotateY}deg`,
        }}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="hero-phone-glow pointer-events-none absolute inset-x-[8%] bottom-2 top-[14%] rounded-[2.5rem]" />
        <div className="hero-phone-orbit pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-white/28 blur-2xl" />
        <div className="hero-phone-orbit hero-phone-orbit-delayed pointer-events-none absolute -left-5 bottom-16 h-20 w-20 rounded-full bg-fuchsia-100/30 blur-2xl" />

        <div
          className="hero-phone-card relative rounded-[2rem] border border-white/40 bg-white/20 p-3 backdrop-blur-xl sm:p-4"
          data-hovering={tilt.isHovering ? 'true' : 'false'}
        >
          <div className="hero-phone-device relative overflow-hidden rounded-[1.65rem] border border-white/70 bg-white p-3 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.45)] sm:p-4">
            <div className="hero-phone-notch pointer-events-none absolute left-1/2 top-3 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-slate-950/88 shadow-[0_6px_18px_rgba(15,23,42,0.24)] sm:top-4" />
            <img
              src={imageSrc}
              alt={imageAlt}
              className="hero-phone-image h-[280px] w-full rounded-[1.35rem] object-cover object-center sm:h-[340px]"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="hero-phone-badge absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/72 px-4 py-3 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-rose-600">ConectaDeco Edition</p>
            <p className="mt-1 text-xs text-slate-500">Ultra resistente, ligera y elegante.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
