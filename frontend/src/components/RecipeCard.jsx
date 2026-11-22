import { useMemo, useState } from "react";

const UNICODE_FRACTIONS = {
  "½": 1 / 2,
  "⅓": 1 / 3,
  "⅔": 2 / 3,
  "¼": 1 / 4,
  "¾": 3 / 4,
  "⅛": 1 / 8,
  "⅜": 3 / 8,
  "⅝": 5 / 8,
  "⅞": 7 / 8,
};

function formatQuantity(value) {
  if (!Number.isFinite(value)) return "";
  const whole = Math.floor(value + 1e-9);
  const remainder = value - whole;
  const fractionPairs = [
    [0.125, "⅛"],
    [0.25, "¼"],
    [1 / 3, "⅓"],
    [0.375, "⅜"],
    [0.5, "½"],
    [0.625, "⅝"],
    [2 / 3, "⅔"],
    [0.75, "¾"],
    [0.875, "⅞"],
  ];
  for (const [frac, glyph] of fractionPairs) {
    if (Math.abs(remainder - frac) < 0.04) {
      return whole > 0 ? `${whole}${glyph}` : glyph;
    }
  }
  if (remainder < 0.04) return `${whole}`;
  return `${Math.round(value * 100) / 100}`;
}

/** Scales a leading quantity (e.g. "1 1/2", "½", "2-3", "1.5") in an ingredient line. */
function scaleIngredientLine(line, factor) {
  if (factor === 1) return line;
  const match = line.match(
    /^\s*((?:\d+\s+\d+\/\d+)|(?:\d+\/\d+)|(?:\d+(?:\.\d+)?)|[½⅓⅔¼¾⅛⅜⅝⅞])(\s*(?:-|–|to)\s*((?:\d+\s+\d+\/\d+)|(?:\d+\/\d+)|(?:\d+(?:\.\d+)?)|[½⅓⅔¼¾⅛⅜⅝⅞]))?/,
  );
  if (!match) return line;

  const parseQuantity = (raw) => {
    const trimmed = raw.trim();
    if (UNICODE_FRACTIONS[trimmed] !== undefined) return UNICODE_FRACTIONS[trimmed];
    const mixed = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
    const fraction = trimmed.match(/^(\d+)\/(\d+)$/);
    if (fraction) return Number(fraction[1]) / Number(fraction[2]);
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const first = parseQuantity(match[1]);
  if (first === null) return line;
  let scaled = formatQuantity(first * factor);
  if (match[3]) {
    const second = parseQuantity(match[3]);
    if (second !== null) {
      const separator = match[2].includes("to") ? " to " : "-";
      scaled = `${scaled}${separator}${formatQuantity(second * factor)}`;
    }
  }
  return scaled + line.slice(match[0].length);
}

function splitIngredients(raw) {
  if (!raw) return [];
  return raw
    .split(/\n|;|,(?=\s*(?:\d|[½⅓⅔¼¾⅛⅜⅝⅞]))/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const SCALE_OPTIONS = [
  { label: "½×", value: 0.5 },
  { label: "1×", value: 1 },
  { label: "2×", value: 2 },
  { label: "3×", value: 3 },
];

export default function RecipeCard({ recipe }) {
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);

  const ingredients = useMemo(() => splitIngredients(recipe?.ingredients), [recipe?.ingredients]);
  const scaledIngredients = useMemo(
    () => ingredients.map((line) => scaleIngredientLine(line, scale)),
    [ingredients, scale],
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = [
      `🌻 ${recipe?.title ?? "Paige's recipe"} — from Paige's Kitchen`,
      ingredients.length ? `\nIngredients:\n${scaledIngredients.map((line) => `• ${line}`).join("\n")}` : "",
      recipe?.instructions ? `\nInstructions:\n${recipe.instructions}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="recipe-print rounded-3xl border border-forest/20 bg-white/80 p-5 shadow-lg backdrop-blur">
      {recipe?.image_url ? (
        <div className="no-print overflow-hidden rounded-2xl">
          <img
            src={recipe.image_url}
            alt={
              recipe.title
                ? `Photo of ${recipe.title}, a recipe from Paige's Kitchen`
                : "Recipe photo from Paige's Kitchen"
            }
            className="h-60 w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div className="no-print flex h-40 items-center justify-center rounded-2xl bg-sunflower/20 text-sm text-forest">
          Image pending upload
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-3">
        <h3 className="text-2xl font-bold text-forest">{recipe?.title ?? "Paige’s next creation"}</h3>
        <span className="rounded-full bg-sunflower/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
          Made by Paige
        </span>
      </div>

      {ingredients.length ? (
        <div className="mt-4">
          <div className="no-print flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/70">Servings</span>
            {SCALE_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setScale(option.value)}
                aria-pressed={scale === option.value}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  scale === option.value
                    ? "bg-forest text-cream"
                    : "border border-forest/40 text-forest hover:bg-forest/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <h4 className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-forest/80">Ingredients</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {scaledIngredients.map((line, index) => (
              <li key={`ingredient-${index}`}>{line}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-700">Ingredients coming soon.</p>
      )}

      <h4 className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-forest/80">Instructions</h4>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
        {recipe?.instructions ?? "Instructions will sprinkle in after the next save."}
      </p>

      <div className="no-print mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-full bg-forest px-4 py-2 text-xs uppercase tracking-[0.35em] text-cream shadow-lg transition hover:bg-forest/90"
        >
          Printable recipe
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full border border-forest px-4 py-2 text-xs uppercase tracking-[0.35em] text-forest transition hover:bg-forest/10"
        >
          {copied ? "Copied ✓" : "Share kindness"}
        </button>
      </div>
    </article>
  );
}
