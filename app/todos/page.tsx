import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApiCall() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/`, {
    cache: "no-store",
  });
  return result.json();
}
export default async function TodosPage() {
  const response = await fetchTodosApiCall();
  return (
    <div className="flex flex-col space-y-10">
      <h1 className={title()}>Todos</h1>
      <TodosTable todos={response.data ?? []} />
    </div>
  );
}
 