type Props = {
  label: string
  active?: boolean // filled in blue, like the current page in the nav
  removable?: boolean // shows a × (for tags already in the search)
  onClick?: () => void
}

// A small hand-cut label for a tag. The same one is used on photo cards and
// in the tag search, so a tag looks the same wherever it shows up.
function Tag({ label, active = false, removable = false, onClick }: Props) {
  const style = `flex h-6 items-center gap-1 rounded-[5px_7px_4px_6px] border-[1.5px] border-ink px-2 pt-[0.15rem] text-[0.95rem] whitespace-nowrap transition-colors ${active ? 'bg-blue/50' : 'bg-card'}`

  if (!onClick) return <span className={style}>{label}</span>
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={removable ? `Remove ${label}` : undefined}
      aria-pressed={removable ? undefined : active}
      className={`${style} cursor-pointer hover:-rotate-2 ${active ? 'hover:bg-blue/65' : 'hover:bg-blue/20'}`}
    >
      {label}
      {removable && <span aria-hidden="true">×</span>}
    </button>
  )
}

export default Tag
