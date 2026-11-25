type OptionButtonProps = {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function OptionButton({
  selected,
  disabled = false,
  onClick,
  children,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`min-w-14 border px-5 py-3 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:text-primary/30 disabled:line-through ${
        selected
          ? 'border-primary bg-primary text-secondary'
          : 'border-primary/20 hover:border-accent'
      }`}
    >
      {children}
    </button>
  );
}
