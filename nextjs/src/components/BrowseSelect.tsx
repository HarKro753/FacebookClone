'use client';

interface BrowseSelectProps {
  name: string;
  label: string;
  defaultValue: string;
  children: React.ReactNode;
}

export default function BrowseSelect({ name, label, defaultValue, children }: BrowseSelectProps) {
  return (
    <form method="get" action="/browse" style={{ display: 'inline' }}>
      <label>{label}:</label>
      <select
        name={name}
        defaultValue={defaultValue}
        onChange={(e) => {
          (e.target.form as HTMLFormElement).submit();
        }}
      >
        {children}
      </select>
    </form>
  );
}
