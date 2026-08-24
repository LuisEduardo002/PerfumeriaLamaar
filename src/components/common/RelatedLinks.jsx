import { Link } from 'react-router-dom';

export default function RelatedLinks({ title = 'Temas relacionados', links = [] }) {
  return (
    <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="space-y-2">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className="font-medium text-[#4B1E28] hover:underline">
              {label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
