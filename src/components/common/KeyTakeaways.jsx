import { Link } from 'react-router-dom';

export default function KeyTakeaways({ title = 'Puntos clave', items = [], cta }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="list-disc pl-6 space-y-1.5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {cta && (
        <Link
          to={cta.to}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4B1E28]"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
