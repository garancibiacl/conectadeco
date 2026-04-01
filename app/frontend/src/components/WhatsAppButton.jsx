export default function WhatsAppButton() {
  const message = encodeURIComponent(
    'Bienvenido a ConectaDeco. Gracias por escribirnos, estaremos felices de ayudarte con tus productos, pedidos o cualquier duda que tengas.',
  )

  return (
    <a
      href={`https://wa.me/56993127198?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_rgba(37,211,102,0.35)] transition-all duration-200 hover:scale-105 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-8 w-8 fill-current"
        >
          <path d="M12 3.2a8.8 8.8 0 0 0-7.52 13.39L3.3 20.7l4.22-1.13A8.8 8.8 0 1 0 12 3.2Zm0 15.95a7.1 7.1 0 0 1-3.62-.99l-.26-.16-2.5.67.67-2.43-.17-.25A7.13 7.13 0 1 1 12 19.15Zm3.91-5.32c-.21-.11-1.25-.61-1.44-.68-.19-.07-.33-.11-.47.11s-.55.68-.67.82c-.12.14-.25.16-.46.05-.21-.11-.87-.32-1.66-1.03-.61-.55-1.03-1.23-1.15-1.44-.12-.21-.01-.32.09-.43.09-.09.21-.25.32-.37.11-.12.14-.21.21-.35.07-.14.04-.27-.02-.37-.05-.11-.47-1.14-.65-1.56-.17-.41-.35-.35-.47-.35h-.4c-.14 0-.36.05-.55.25-.19.21-.72.7-.72 1.72s.74 2  .84 2.13c.1.14 1.45 2.21 3.5 3.1.49.21.87.34 1.17.44.5.16.95.14 1.31.08.4-.06 1.25-.51 1.42-1 .17-.49.17-.91.12-.99-.05-.09-.19-.14-.4-.25Z" />
        </svg>
      </span>
      <span className="sr-only">
        Abrir WhatsApp con mensaje de bienvenida a ConectaDeco
      </span>
    </a>
  )
}
