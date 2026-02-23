import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../hooks/useAuth";
import { getRecipes, publishRecipe, uploadRecipeImage } from "../lib/api";

const blankRecipe = {
  title: "",
  ingredients: "",
  instructions: "",
};

export default function PaigesKitchen() {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [form, setForm] = useState(blankRecipe);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getRecipes(true).then((data) => setLatest(data?.[0] ?? null));
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    try {
      let imageUrl = form.image_url;
      if (image) {
        const uploaded = await uploadRecipeImage(image);
        imageUrl = uploaded?.image_url;
      }
      await publishRecipe({ ...form, image_url: imageUrl });
      setForm(blankRecipe);
      setImage(null);
      setStatus("Paige’s recipe saved!");
    } catch (error) {
      setStatus(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-cream text-slate-900">
      <Nav />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Paige’s Kitchen</p>
          <h1 className="text-4xl font-bold text-forest">Fresh recipes straight from Paige</h1>
          <p className="text-sm text-slate-600">Upload a photo, jot ingredients, and the Worker auto-publishes.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-forest">Latest public recipe</h2>
            {latest ? (
              <RecipeCard recipe={latest} />
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-400 bg-white/70 p-6 text-slate-600">
                No recipes yet. Paige can add the next masterpiece right here.
              </p>
            )}
          </section>
          {user && (user.role === "paige" || user.role === "admin") ? (
            <section className="rounded-3xl border border-forest/20 bg-white/80 p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-forest">Paige admin panel</h2>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                  placeholder="Recipe title"
                />
                <textarea
                  value={form.ingredients}
                  onChange={(event) => setForm((prev) => ({ ...prev, ingredients: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                  placeholder="Ingredients"
                  rows={3}
                />
                <textarea
                  value={form.instructions}
                  onChange={(event) => setForm((prev) => ({ ...prev, instructions: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-forest focus:outline-none"
                  placeholder="Instructions"
                  rows={4}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                  className="text-xs text-slate-600"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-forest px-4 py-2 text-xs uppercase tracking-[0.4em] text-cream"
                >
                  Publish
                </button>
              </form>
              {status && <p className="mt-3 text-sm text-forest">{status}</p>}
            </section>
          ) : (
            <section className="rounded-3xl border border-dashed border-slate-400 bg-white/70 p-6 text-sm text-slate-600">
              Paige-only editing is reserved for the kitchen & shorts editors.
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
