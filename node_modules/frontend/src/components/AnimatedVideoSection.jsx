export default function AnimatedVideoSection() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-sunlight-streaming-through-the-leaves-of-a-tree-4009-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">Beautiful Moments</h2>
        <p className="text-lg opacity-90 drop-shadow-md">Captured in the warmth of our sunlit home.</p>
      </div>
      
      {/* Decorative overlay for "love" theme */}
      <div className="absolute top-4 right-4 flex gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">❤️</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">💖</span>
      </div>
    </section>
  );
}
