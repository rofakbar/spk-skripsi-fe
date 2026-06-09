export default function AlternativeCard({
  alternative,
  criteria,
  formData,
  handleChange,
}) {
  const values = formData[alternative.id] || {};

  const renderInput = (criterion) => {
    const key = `c${criterion.id}`;

    // C4 slider tetap
    if (criterion.nama === "Penguasaan Skill") {
      return (
        <>
          <input
            type="range"
            min="1"
            max="5"
            value={values[key] || 3}
            onChange={(e) =>
              handleChange(alternative.id, key, Number(e.target.value))
            }
            className="w-full accent-teal-700"
          />

          <div className="text-right text-sm font-medium text-teal-700">
            {values[key] || 3}
            /5
          </div>
        </>
      );
    }

    // Dataset style button
    if (criterion.nama.includes("Dataset")) {
      return (
        <div className="grid grid-cols-5 gap-2">
          {["Sulit", "Cukup", "Netral", "Mudah", "Sangat Mudah"].map(
            (label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChange(alternative.id, key, i + 1)}
                className={`border rounded-lg py-2 text-xs transition
                ${
                  values[key] === i + 1
                    ? "bg-teal-700 text-white border-teal-700"
                    : "hover:border-teal-700"
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      );
    }

    // default semua criteria
    return (
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => handleChange(alternative.id, key, n)}
            className={`border rounded-xl py-2 transition font-medium
              ${
                values[key] === n
                  ? "bg-teal-700 text-white border-teal-700"
                  : "hover:border-teal-700"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-semibold text-teal-700 text-lg">
            {alternative.kode} - {alternative.nama_topik}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {alternative.kompetensi_lulusan}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {criteria
          .filter((criterion) => criterion.kode !== "C1")
          .map((criterion) => (
            <div key={criterion.id}>
              <label className="font-medium text-sm block mb-3">
                {criterion.kode}. {criterion.nama}
              </label>

              {renderInput(criterion)}
            </div>
          ))}
      </div>
    </div>
  );
}
