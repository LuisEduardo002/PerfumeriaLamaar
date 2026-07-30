export default function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse rounded-2xl border border-stone-200 bg-white p-4">
      <div className="aspect-square rounded-xl bg-stone-100" />
      <div className="mt-4 h-3 w-1/3 rounded bg-stone-100" />
      <div className="mt-3 h-5 w-3/4 rounded bg-stone-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-stone-100" />
      <div className="mt-5 h-10 rounded-full bg-stone-100" />
    </div>
  );
}
