const SkeletonCard = () => (
  <div className="w-full">
    <div className="aspect-[2/3] skeleton rounded-xl mb-2" />
    <div className="skeleton h-3 rounded w-4/5 mb-1.5" />
    <div className="skeleton h-2 rounded w-2/5" />
  </div>
);

export const SkeletonBanner = () => (
  <div className="w-full h-[75vh] skeleton rounded-2xl mb-8" />
);

export const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export default SkeletonCard;
