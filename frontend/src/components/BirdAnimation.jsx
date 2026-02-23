const BIRD_COUNT = 6;

export default function BirdAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: BIRD_COUNT }).map((_, index) => (
        <span
          key={`bird-${index}`}
          className="absolute h-6 w-10 rounded-full bg-sky/80 blur-sm shadow-lg animate-bird"
          style={{
            top: `${10 + index * 8}%`,
            left: `${(index * 35) % 80}%`,
            animationDelay: `${index * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}
