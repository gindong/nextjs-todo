import { NextRequest, NextResponse } from "next/server";
import { fetchTodo, deleteTodo, modifyTodo } from '@/data/firestore'

//할일 조회
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  //const serarchParamms = request.nextUrl.searchParams
  //const search = serarchParamms.get('search')

  console.log(params.slug);
  const fetchedTodo = await fetchTodo(params.slug);

  if(fetchedTodo === null) return new Response(null, {status:204});

  const response = {
    message: '할일 상세정보 가져오기',
    data: fetchedTodo
  }
  return NextResponse.json(response,{status: 200});
}

//할일삭제
export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {

  const result = await deleteTodo(params.slug);

  if(result === null) return new Response(null,{status:204});

  const response = {
    message: '할일 삭제',
    data: result
  }
  return NextResponse.json(response,{status: 200});
}

//할일수정
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  
  
  const {title, is_done} = await request.json()


  const modTodo =  await modifyTodo(params.slug,{title:title,is_done:is_done})

  if(modTodo === null) return new Response(null,{status:204});

  const response = {
    message: '할일 수정',
    data: modTodo
  }
  return NextResponse.json(response,{status: 200});
}