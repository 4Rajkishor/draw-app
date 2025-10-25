export default function Features() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-12">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg text-center">
          <h3 className="font-semibold">Real-time Collaboration</h3>
          <p className="text-gray-600 text-sm mt-2">Work together instantly.</p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="font-semibold">Shapes & Tools</h3>
          <p className="text-gray-600 text-sm mt-2">Draw anything easily.</p>
        </div>
        <div className="p-6 border rounded-lg text-center">
          <h3 className="font-semibold">Save & Export</h3>
          <p className="text-gray-600 text-sm mt-2">Keep your work forever.</p>
        </div>
      </div>
    </section>
  );
}
