import SearchInput from "./components/SearchInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
      <div className="w-full max-w-2xl p-6">
        <h1 className="text-4xl font-semibold text-center text-gray-100 mb-6">
          MealExplorer
        </h1>
        <SearchInput />
      </div>
    </div>
  );
}
