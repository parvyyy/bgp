import { useEffect, useState } from 'react'

const DEBOUNCE_MS = 150
const MAX_SUGGESTIONS = 5

type Props = {
  tags: string[] // every tag, most used first
  selected: string[]
  onChange: (selected: string[]) => void
}

// A search box that suggests tags as you type. Picking a suggestion adds it
// to `selected`; selected tags show as pills you can remove.
function TagSearch({ tags, selected, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('') // `query`, but debounced
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(0) // highlighted suggestion

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim().toLowerCase())
      setActive(0)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  // Tags containing the search, those starting with it first.
  const suggestions = search
    ? tags
        .filter((tag) => tag.includes(search) && !selected.includes(tag))
        .sort((a, b) => Number(b.startsWith(search)) - Number(a.startsWith(search)))
        .slice(0, MAX_SUGGESTIONS)
    : []
  const open = focused && suggestions.length > 0

  function add(tag: string) {
    onChange([...selected, tag])
    setQuery('')
    setSearch('')
    setActive(0)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const count = suggestions.length
    if (event.key === 'ArrowDown' && count > 0) {
      event.preventDefault() // don't move the text cursor
      setActive((active + 1) % count)
    }
    if (event.key === 'ArrowUp' && count > 0) {
      event.preventDefault()
      setActive((active - 1 + count) % count)
    }
    if (event.key === 'Enter' && count > 0) add(suggestions[active])
    if (event.key === 'Escape') setQuery('')
    if (event.key === 'Backspace' && query === '' && selected.length > 0) {
      onChange(selected.slice(0, -1))
    }
  }

  return (
    <div className="relative flex w-80 flex-wrap items-center gap-1.5 border-b-[2.6px] border-ink px-1 py-1">
      {selected.map((tag) => (
        <button
          key={tag}
          type="button"
          className="cursor-pointer rounded-[5px_7px_4px_6px] bg-accent px-2.5 pt-[0.2rem] pb-px text-[0.95rem] text-paper"
          aria-label={`Remove ${tag}`}
          onClick={() => onChange(selected.filter((t) => t !== tag))}
        >
          {tag} ×
        </button>
      ))}

      <input
        type="search"
        placeholder={selected.length ? 'add a tag…' : 'filter by tag…'}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        role="combobox"
        aria-expanded={open}
        aria-controls="tag-suggestions"
        aria-autocomplete="list"
        aria-activedescendant={open ? `tag-suggestion-${active}` : undefined}
        // The browser's own clear button is hidden; Escape clears instead.
        className="min-w-32 flex-1 text-[1.1rem] outline-none placeholder:text-pencil [&::-webkit-search-cancel-button]:hidden"
      />

      {open && (
        <ul
          id="tag-suggestions"
          role="listbox"
          className="rounded-wobbly absolute inset-x-0 top-[calc(100%+6px)] z-20 border-[2.6px] border-ink bg-card p-1"
        >
          {suggestions.map((tag, i) => (
            // preventDefault keeps focus in the input, so you can keep typing.
            <li
              key={tag}
              id={`tag-suggestion-${i}`}
              role="option"
              aria-selected={i === active}
              className="cursor-pointer rounded px-2.5 pt-1 pb-0.5 aria-selected:bg-accent/15"
              onMouseEnter={() => setActive(i)}
              onMouseDown={(event) => {
                event.preventDefault()
                add(tag)
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagSearch
