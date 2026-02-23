export default function RecipeCard({ recipe }) {
  return (
    <div className="rounded-3xl border border-forest/20 bg-white/80 p-5 shadow-lg backdrop-blur">
      {recipe?.image_url ? (
        <div className="overflow-hidden rounded-2xl">
          <img src={recipe.image_url} alt={recipe.title} className="h-60 w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-2xl bg-sunflower/20 text-sm text-forest">
          Image pending upload
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-forest">{recipe?.title ?? "Paige’s next creation"}</h3>
        <span className="rounded-full bg-sunflower/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
          Made by Paige
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-700">
        {recipe?.ingredients ? `Ingredients: ${recipe.ingredients}` : "Ingredients coming soon."}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        {recipe?.instructions ?? "Instructions will sprinkle in after the next save."}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-full bg-forest px-4 py-2 text-xs uppercase tracking-[0.35em] text-cream shadow-lg">
          Printable recipe
        </button>
        <button className="rounded-full border border-forest px-4 py-2 text-xs uppercase tracking-[0.35em] text-forest">
          Share kindness
        </button>
      </div>
    </div>
  );
}
