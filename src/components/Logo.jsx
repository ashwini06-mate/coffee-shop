export default function Logo({ size = 36 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <rect x="0.75" y="0.75" width="34.5" height="34.5" rx="10" fill="#1c120c" stroke="#ead9c2" strokeWidth="1.5" />
      <path
        d="M18 9.2c3.4 1.2 6 4.2 6 8.1 0 4.4-2.8 7.7-6 9.5-3.2-1.8-6-5.1-6-9.5 0-3.9 2.6-6.9 6-8.1Z"
        fill="none"
        stroke="#f6efe6"
        strokeWidth="1.5"
      />
      <path d="M18 11.2c.8 2.2.8 4.6 0 8.2" fill="none" stroke="#e0b56a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
