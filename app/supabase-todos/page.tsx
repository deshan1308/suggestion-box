import { createClient } from "@/utils/supabase/server";

export default async function SupabaseTodosPage() {
  const supabase = await createClient();
  const { data: todos } = await supabase.from("todos").select();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Supabase Todos</h1>
      <ul className="space-y-2">
        {todos?.map((todo: { id: string; name: string }) => (
          <li key={todo.id} className="rounded border border-slate-200 bg-white p-3">
            {todo.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
