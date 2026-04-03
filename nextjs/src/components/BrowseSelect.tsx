'use client';

interface BrowseSelectProps {
  name: string;
  label: string;
  defaultValue: string;
  children: React.ReactNode;
}

export default function BrowseSelect({ name, label, defaultValue, children }: BrowseSelectProps) {
  return (
    <form method="get" action="/browse" className="inline">
      <label className="font-bold mr-1">{label}:</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mr-4"
        onChange={(e) => {
          (e.target.form as HTMLFormElement).submit();
        }}
      >
        {children}
      </select>
    </form>
  );
}
