
export default function inicioLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
      <section className="border-2 border-red-500">
        <p>Aqui va el navbar</p>
      </section>
      {children}
      </div>
    )
  }