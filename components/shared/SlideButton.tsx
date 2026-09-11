import Link from 'next/link';

interface SlideButtonProps {
  href: string;
  label: string;
  /** Slide overlay color, defaults to bg-blue-800 */
  overlayClass?: string;
  /** Base background color, defaults to bg-blue-600 */
  baseClass?: string;
  /** Text color, defaults to text-white */
  textClass?: string;
  className?: string;
}

export function SlideButton({
  href,
  label,
  overlayClass = 'bg-blue-800',
  baseClass = 'bg-blue-600',
  textClass = 'text-white',
  className = '',
}: SlideButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-2 px-5 py-2.5 ${baseClass} ${textClass} text-sm font-semibold rounded-md overflow-hidden transition-all duration-200 ${className}`}
    >
      <span
        className={`absolute inset-0 ${overlayClass} -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out`}
      />
      <span className="relative">{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative transition-transform duration-200 group-hover:translate-x-1"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  );
}
